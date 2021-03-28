window[$onDomComplete](function(){
  if (typeof performance === 'object') {
    var report = {}, timing, usec = function(n){return Math.round(n*1000)|0;};
    try { timing = performance.getEntriesByType("navigation"); } catch(e) {}
    timing = timing && timing.length ? timing[0] : performance.timing;

    report['type'] = timing.type;
    report['dns'] = usec(timing.domainLookupEnd - timing.domainLookupStart);
    if (timing.secureConnectionStart) {
      report['tcp'] = usec(timing.secureConnectionStart - timing.connectStart);
      report['tls'] = usec(timing.connectEnd - timing.secureConnectionStart);
    } else {
      report['tcp'] = usec(timing.connectEnd - timing.connectStart);
    }
    report['wait'] = usec(timing.responseStart - timing.requestStart);
    report['xfer'] = usec(timing.responseEnd - timing.responseStart);

    report['intr'] = usec(timing.domInteractive - timing.responseEnd);
    report['load'] = usec(timing.domComplete - timing.responseEnd);

    logStats({'timing':report});
    }
});
