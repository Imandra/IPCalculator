function calculate() {
    var ip = document.getElementById('ip').value;
    var pattern = /^\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*\.\s*(\d{1,3})\s*$/;

    if (ip.search(pattern) == -1) {
        alert('Illegal value for IP address');
        return;
    }

    ip = ip.split('.');

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

        netMask = netMask.split('.');

        for (var k = 0; k < 3; k++) {
            if (parseInt(netMask[k]) < parseInt(netMask[k + 1])) {
                alert('Illegal value for NetMask');
                return;
            }

            if ((netMask[k] < 255) && (netMask[k + 1] != 0)) {
                alert('Illegal value for NetMask');
                return;
            }
        }

        var validValues = [0, 128, 192, 224, 240, 248, 252, 254, 255];
        var netMaskBinary = '';

        for (var n = 0; n < 4; n++) {
            if (validValues.indexOf(parseInt(netMask[n])) === -1) {
                alert('Illegal value for NetMask');
                return;
            }
            netMaskBinary += parseInt(netMask[n]).toString(2);
        }

        while (netMaskBinary[prefix] == 1) {
            prefix++;
        }

        document.getElementById('prefix').value = prefix;

    } else {
        prefix = parseInt(document.getElementById('prefix').value);

        if ((prefix > 32) || (prefix < 0)) {
            alert('Illegal value for Prefix');
            return;
        }
        if (isNaN(prefix)) {
            alert('Illegal value for Prefix');
            return;
        }

        netMask = [0, 0, 0, 0];

        for (var m = 0; m < prefix; m++) {
            netMask[Math.floor(m / 8)] += 1 << (7 - m % 8);
        }

        document.getElementById('net_mask').value = netMask.join('.');
    }

    var netIp = [];

    for (var x = 0; x < 4; x++) {
        netIp [x] = ip [x] & netMask [x];
    }

    document.getElementById('net_ip').value = netIp.join('.');

    var broadcast = [];

    for (var y = 0; y < 4; y++) {
        broadcast [y] = ip [y] | (255 - netMask [y]);
    }

    document.getElementById('broadcast').value = broadcast.join('.');
    document.getElementById('hosts').value = Math.pow(2, 32 - prefix) - 2;
}

function setReadOnly() {
    if (document.getElementById('prefix').readOnly) {
        document.getElementById('prefix').readOnly = false;
        document.getElementById('net_mask').readOnly = true;
        document.getElementById('net_mask').value = '';

    } else {
        document.getElementById('prefix').readOnly = true;
        document.getElementById('net_mask').readOnly = false;
        document.getElementById('prefix').value = '';
    }
}

function setDefault() {
    document.getElementById('prefix').readOnly = true;
    document.getElementById('net_mask').readOnly = false;
}