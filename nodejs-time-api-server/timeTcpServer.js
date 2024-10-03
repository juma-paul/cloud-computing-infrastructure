const net = require('net');

function padZero(number) {
    return (number < 10 ? '0' : '') + number; 
}

function getCurrentTimestamp() {
    const currentDate = new Date();
    const date = `${currentDate.getFullYear()}-${padZero(currentDate.getMonth() + 1)}-${padZero(currentDate.getDate())}`;
    const time = `${padZero(currentDate.getHours())}:${padZero(currentDate.getMinutes())}`;
    return (date + ' ' + time);
}

function getCurrentTimestampJson() {
    const currentDate = new Date();
    return {
        hour: padZero(currentDate.getHours()),
        minute: padZero(currentDate.getMinutes()),
        second: padZero(currentDate.getSeconds())
    };
}

function startTcpServer(port) {
    const tcpServer = net.createServer((socket) => {
        socket.write('HTTP/1.1 200 OK\n\n');
        socket.end(`${getCurrentTimestamp()}\n`);
    });

    tcpServer.listen(port, () => {
        console.log(`Time Server is listening on port ${port}`);
    });
}

// Export functions for reuse
module.exports = { padZero, getCurrentTimestampJson};

// Only start the server if this file is run directly
if (require.main === module) {
    const tcpPort = Number(process.argv[2]);
    if (isNaN(tcpPort)) {
        console.error('Invalid port number. Provide a valid number.');
        process.exit(1);
    }
    startTcpServer(tcpPort);
}