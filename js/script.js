function calculate() {
    var ip = document.getElementById('ip').value;
    var pattern = /^\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*$/;

    if (ip.search(pattern) == -1) {
        alert('Illegal value for IP address');
        return;
    }
    ip = ip.split(".");
    for (var j = 0; j < 4; j++) {
        if (ip [j] > 255) {
            alert('Illegal value for IP address');
            return;
        }
    }

    var prefix = 0;
    var netMask;

    if (document.getElementById('mask').checked) {
        netMask = document.getElementById('net_mask').value;

        if (netMask.search(pattern) == -1) {
            alert('Illegal value for NetMask');
            return;
        }

        netMask = netMask.split(".");

        for (var k = 0; k < netMask.length - 1; k++) {
            if (netMask[k] * 1 < netMask[k + 1] * 1) {
                alert('Illegal value for NetMask');
                return;
            }
            if ((netMask[k] < 255) && (netMask[k + 1] != 0)) {
                alert('Illegal value for NetMask');
                return;
            }
        }
        var validValues = [0, 128, 192, 224, 240, 248, 252, 254, 255];

        for (var n = 0; n < netMask.length; n++) {
            if (!inArray(netMask [n], validValues)) {
                alert('Illegal value for NetMask');
                return;
            }

            prefix += numOfBits(netMask [n]);
        }

        document.getElementById('prefix').value = prefix;
    }

    else {
        prefix = parseInt(document.getElementById('prefix').value);

        if ((prefix > 32) || (prefix < 1)) {
            alert("Illegal value for Prefix");
            return;
        }
        if (isNaN(prefix)) {
            alert("Illegal value for Prefix");
            return;
        }

        netMask = [0, 0, 0, 0];

        for (var m = 0; m < prefix; m++) {
            netMask[Math.floor(m / 8)] += 1 << (7 - m % 8);
        }
        document.getElementById('net_mask').value = netMask.join(".");
    }
    
    var netIp = [];

    for (var x = 0; x < 4; x++) {
        netIp [x] = ip [x] & netMask [x];
    }

    document.getElementById('net_ip').value = netIp.join(".");

    var broadcast = [];

    for (var y = 0; y < 4; y++) {
        broadcast [y] = ip [y] | (256 + ~netMask [y]);
    }

    document.getElementById('broadcast').value = broadcast.join(".");
    document.getElementById('hosts').value = Math.pow(2, 32 - prefix) - 2;
}

function setReadOnly() {
    if (document.getElementById('prefix').readOnly) {
        document.getElementById('prefix').readOnly = false;
        document.getElementById('net_mask').readOnly = true;
        document.getElementById('net_mask').value = "";
    }
    else {
        document.getElementById('prefix').readOnly = true;
        document.getElementById('net_mask').readOnly = false;
        document.getElementById('prefix').value = "";
    }
}

function setDefault() {
    document.getElementById('prefix').readOnly = true;
    document.getElementById('net_mask').readOnly = false;
}

/**
 * @return {number}
 */
function numOfBits(x) {
    var t = 0;
    while (x != 0) {
        t += 1;
        x &= x - 1; //сбрасываем крайний бит справа
    }
    return t;
}

function inArray(value, array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == value) return true;
    }
    return false;
}