
module.exports = (server, options) => {
  server.on('request', (req, res) => {
    if (req.originalReq.headers['from-res-cache']) {
      res.end('* style://color=red');
      return;
    }
    res.end();
  });
};
