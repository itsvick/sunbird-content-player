/**
 * @author Krushanu Mohapatra<Krushanu.Mohapatra@tarento.com>
 */
var detectClient = function() {

        var nAgt = navigator.userAgent;
        var browserName = navigator.appName;
        var fullVersion = '' + parseFloat(navigator.appVersion);
        var nameOffset, verOffset, ix;

        // In Opera
        /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
        if ((verOffset = nAgt.indexOf("Opera")) != -1) {
            browserName = "opera";
            fullVersion = nAgt.substring(verOffset + 6);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In MSIE
        else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
            browserName = "IE";
            fullVersion = nAgt.substring(verOffset + 5);
        }
        // In Chrome
        else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
            browserName = "chrome";
            fullVersion = nAgt.substring(verOffset + 7);
        }
        // In Safari
        else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
            browserName = "safari";
            fullVersion = nAgt.substring(verOffset + 7);
            if ((verOffset = nAgt.indexOf("Version")) != -1)
                fullVersion = nAgt.substring(verOffset + 8);
        }
        // In Firefox
        else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
            browserName = "firefox";
            fullVersion = nAgt.substring(verOffset + 8);
        }

        // trim the fullVersion string at semicolon/space if present
        /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
        if ((ix = fullVersion.indexOf(";")) != -1)
            fullVersion = fullVersion.substring(0, ix);
        /* istanbul ignore next. Cannot test this as the test cases runs in phatomjs browser */
        if ((ix = fullVersion.indexOf(" ")) != -1)
            fullVersion = fullVersion.substring(0, ix);

        return { browser: browserName, browserver: fullVersion, os: navigator.platform };
    }

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(s, p) {
    var m = {},
        l = m.lib = {},
        n = function() {},
        r = l.Base = {
            extend: function(b) {
                n.prototype = this;
                var h = new n;
                b && h.mixIn(b);
                h.hasOwnProperty("init") || (h.init = function() {
                    h.$super.init.apply(this, arguments)
                });
                h.init.prototype = h;
                h.$super = this;
                return h
            },
            create: function() {
                var b = this.extend();
                b.init.apply(b, arguments);
                return b
            },
            init: function() {},
            mixIn: function(b) {
                for (var h in b) b.hasOwnProperty(h) && (this[h] = b[h]);
                b.hasOwnProperty("toString") && (this.toString = b.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        q = l.WordArray = r.extend({
            init: function(b, h) {
                b = this.words = b || [];
                this.sigBytes = h != p ? h : 4 * b.length
            },
            toString: function(b) {
                return (b || t).stringify(this)
            },
            concat: function(b) {
                var h = this.words,
                    a = b.words,
                    j = this.sigBytes;
                b = b.sigBytes;
                this.clamp();
                if (j % 4)
                    for (var g = 0; g < b; g++) h[j + g >>> 2] |= (a[g >>> 2] >>> 24 - 8 * (g % 4) & 255) << 24 - 8 * ((j + g) % 4);
                else if (65535 < a.length)
                    for (g = 0; g < b; g += 4) h[j + g >>> 2] = a[g >>> 2];
                else h.push.apply(h, a);
                this.sigBytes += b;
                return this
            },
            clamp: function() {
                var b = this.words,
                    h = this.sigBytes;
                b[h >>> 2] &= 4294967295 <<
                    32 - 8 * (h % 4);
                b.length = s.ceil(h / 4)
            },
            clone: function() {
                var b = r.clone.call(this);
                b.words = this.words.slice(0);
                return b
            },
            random: function(b) {
                for (var h = [], a = 0; a < b; a += 4) h.push(4294967296 * s.random() | 0);
                return new q.init(h, b)
            }
        }),
        v = m.enc = {},
        t = v.Hex = {
            stringify: function(b) {
                var a = b.words;
                b = b.sigBytes;
                for (var g = [], j = 0; j < b; j++) {
                    var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 255;
                    g.push((k >>> 4).toString(16));
                    g.push((k & 15).toString(16))
                }
                return g.join("")
            },
            parse: function(b) {
                for (var a = b.length, g = [], j = 0; j < a; j += 2) g[j >>> 3] |= parseInt(b.substr(j,
                    2), 16) << 24 - 4 * (j % 8);
                return new q.init(g, a / 2)
            }
        },
        a = v.Latin1 = {
            stringify: function(b) {
                var a = b.words;
                b = b.sigBytes;
                for (var g = [], j = 0; j < b; j++) g.push(String.fromCharCode(a[j >>> 2] >>> 24 - 8 * (j % 4) & 255));
                return g.join("")
            },
            parse: function(b) {
                for (var a = b.length, g = [], j = 0; j < a; j++) g[j >>> 2] |= (b.charCodeAt(j) & 255) << 24 - 8 * (j % 4);
                return new q.init(g, a)
            }
        },
        u = v.Utf8 = {
            stringify: function(b) {
                try {
                    return decodeURIComponent(escape(a.stringify(b)))
                } catch (g) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(b) {
                return a.parse(unescape(encodeURIComponent(b)))
            }
        },
        g = l.BufferedBlockAlgorithm = r.extend({
            reset: function() {
                this._data = new q.init;
                this._nDataBytes = 0
            },
            _append: function(b) {
                "string" == typeof b && (b = u.parse(b));
                this._data.concat(b);
                this._nDataBytes += b.sigBytes
            },
            _process: function(b) {
                var a = this._data,
                    g = a.words,
                    j = a.sigBytes,
                    k = this.blockSize,
                    m = j / (4 * k),
                    m = b ? s.ceil(m) : s.max((m | 0) - this._minBufferSize, 0);
                b = m * k;
                j = s.min(4 * b, j);
                if (b) {
                    for (var l = 0; l < b; l += k) this._doProcessBlock(g, l);
                    l = g.splice(0, b);
                    a.sigBytes -= j
                }
                return new q.init(l, j)
            },
            clone: function() {
                var b = r.clone.call(this);
                b._data = this._data.clone();
                return b
            },
            _minBufferSize: 0
        });
    l.Hasher = g.extend({
        cfg: r.extend(),
        init: function(b) {
            this.cfg = this.cfg.extend(b);
            this.reset()
        },
        reset: function() {
            g.reset.call(this);
            this._doReset()
        },
        update: function(b) {
            this._append(b);
            this._process();
            return this
        },
        finalize: function(b) {
            b && this._append(b);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(b) {
            return function(a, g) {
                return (new b.init(g)).finalize(a)
            }
        },
        _createHmacHelper: function(b) {
            return function(a, g) {
                return (new k.HMAC.init(b,
                    g)).finalize(a)
            }
        }
    });
    var k = m.algo = {};
    return m
}(Math);
(function(s) {
    function p(a, k, b, h, l, j, m) {
        a = a + (k & b | ~k & h) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    function m(a, k, b, h, l, j, m) {
        a = a + (k & h | b & ~h) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    function l(a, k, b, h, l, j, m) {
        a = a + (k ^ b ^ h) + l + m;
        return (a << j | a >>> 32 - j) + k
    }

    function n(a, k, b, h, l, j, m) {
        a = a + (b ^ (k | ~h)) + l + m;
        return (a << j | a >>> 32 - j) + k
    }
    for (var r = CryptoJS, q = r.lib, v = q.WordArray, t = q.Hasher, q = r.algo, a = [], u = 0; 64 > u; u++) a[u] = 4294967296 * s.abs(s.sin(u + 1)) | 0;
    q = q.MD5 = t.extend({
        _doReset: function() {
            this._hash = new v.init([1732584193, 4023233417, 2562383102, 271733878])
        },
        _doProcessBlock: function(g, k) {
            for (var b = 0; 16 > b; b++) {
                var h = k + b,
                    w = g[h];
                g[h] = (w << 8 | w >>> 24) & 16711935 | (w << 24 | w >>> 8) & 4278255360
            }
            var b = this._hash.words,
                h = g[k + 0],
                w = g[k + 1],
                j = g[k + 2],
                q = g[k + 3],
                r = g[k + 4],
                s = g[k + 5],
                t = g[k + 6],
                u = g[k + 7],
                v = g[k + 8],
                x = g[k + 9],
                y = g[k + 10],
                z = g[k + 11],
                A = g[k + 12],
                B = g[k + 13],
                C = g[k + 14],
                D = g[k + 15],
                c = b[0],
                d = b[1],
                e = b[2],
                f = b[3],
                c = p(c, d, e, f, h, 7, a[0]),
                f = p(f, c, d, e, w, 12, a[1]),
                e = p(e, f, c, d, j, 17, a[2]),
                d = p(d, e, f, c, q, 22, a[3]),
                c = p(c, d, e, f, r, 7, a[4]),
                f = p(f, c, d, e, s, 12, a[5]),
                e = p(e, f, c, d, t, 17, a[6]),
                d = p(d, e, f, c, u, 22, a[7]),
                c = p(c, d, e, f, v, 7, a[8]),
                f = p(f, c, d, e, x, 12, a[9]),
                e = p(e, f, c, d, y, 17, a[10]),
                d = p(d, e, f, c, z, 22, a[11]),
                c = p(c, d, e, f, A, 7, a[12]),
                f = p(f, c, d, e, B, 12, a[13]),
                e = p(e, f, c, d, C, 17, a[14]),
                d = p(d, e, f, c, D, 22, a[15]),
                c = m(c, d, e, f, w, 5, a[16]),
                f = m(f, c, d, e, t, 9, a[17]),
                e = m(e, f, c, d, z, 14, a[18]),
                d = m(d, e, f, c, h, 20, a[19]),
                c = m(c, d, e, f, s, 5, a[20]),
                f = m(f, c, d, e, y, 9, a[21]),
                e = m(e, f, c, d, D, 14, a[22]),
                d = m(d, e, f, c, r, 20, a[23]),
                c = m(c, d, e, f, x, 5, a[24]),
                f = m(f, c, d, e, C, 9, a[25]),
                e = m(e, f, c, d, q, 14, a[26]),
                d = m(d, e, f, c, v, 20, a[27]),
                c = m(c, d, e, f, B, 5, a[28]),
                f = m(f, c,
                    d, e, j, 9, a[29]),
                e = m(e, f, c, d, u, 14, a[30]),
                d = m(d, e, f, c, A, 20, a[31]),
                c = l(c, d, e, f, s, 4, a[32]),
                f = l(f, c, d, e, v, 11, a[33]),
                e = l(e, f, c, d, z, 16, a[34]),
                d = l(d, e, f, c, C, 23, a[35]),
                c = l(c, d, e, f, w, 4, a[36]),
                f = l(f, c, d, e, r, 11, a[37]),
                e = l(e, f, c, d, u, 16, a[38]),
                d = l(d, e, f, c, y, 23, a[39]),
                c = l(c, d, e, f, B, 4, a[40]),
                f = l(f, c, d, e, h, 11, a[41]),
                e = l(e, f, c, d, q, 16, a[42]),
                d = l(d, e, f, c, t, 23, a[43]),
                c = l(c, d, e, f, x, 4, a[44]),
                f = l(f, c, d, e, A, 11, a[45]),
                e = l(e, f, c, d, D, 16, a[46]),
                d = l(d, e, f, c, j, 23, a[47]),
                c = n(c, d, e, f, h, 6, a[48]),
                f = n(f, c, d, e, u, 10, a[49]),
                e = n(e, f, c, d,
                    C, 15, a[50]),
                d = n(d, e, f, c, s, 21, a[51]),
                c = n(c, d, e, f, A, 6, a[52]),
                f = n(f, c, d, e, q, 10, a[53]),
                e = n(e, f, c, d, y, 15, a[54]),
                d = n(d, e, f, c, w, 21, a[55]),
                c = n(c, d, e, f, v, 6, a[56]),
                f = n(f, c, d, e, D, 10, a[57]),
                e = n(e, f, c, d, t, 15, a[58]),
                d = n(d, e, f, c, B, 21, a[59]),
                c = n(c, d, e, f, r, 6, a[60]),
                f = n(f, c, d, e, z, 10, a[61]),
                e = n(e, f, c, d, j, 15, a[62]),
                d = n(d, e, f, c, x, 21, a[63]);
            b[0] = b[0] + c | 0;
            b[1] = b[1] + d | 0;
            b[2] = b[2] + e | 0;
            b[3] = b[3] + f | 0
        },
        _doFinalize: function() {
            var a = this._data,
                k = a.words,
                b = 8 * this._nDataBytes,
                h = 8 * a.sigBytes;
            k[h >>> 5] |= 128 << 24 - h % 32;
            var l = s.floor(b /
                4294967296);
            k[(h + 64 >>> 9 << 4) + 15] = (l << 8 | l >>> 24) & 16711935 | (l << 24 | l >>> 8) & 4278255360;
            k[(h + 64 >>> 9 << 4) + 14] = (b << 8 | b >>> 24) & 16711935 | (b << 24 | b >>> 8) & 4278255360;
            a.sigBytes = 4 * (k.length + 1);
            this._process();
            a = this._hash;
            k = a.words;
            for (b = 0; 4 > b; b++) h = k[b], k[b] = (h << 8 | h >>> 24) & 16711935 | (h << 24 | h >>> 8) & 4278255360;
            return a
        },
        clone: function() {
            var a = t.clone.call(this);
            a._hash = this._hash.clone();
            return a
        }
    });
    r.MD5 = t._createHelper(q);
    r.HmacMD5 = t._createHmacHelper(q)
})(Math);
/**
 * this is the Telemetry Interface
 * @author Krushanu Mohapatra <Krushanu.Mohapatra@tarento.com>
 */

var Telemetry = (function() {
    this.telemetry = function(){ };
    var instance = function(){ };
    this.telemetry.initialized = false;
    this.telemetry.config = undefined;
    this.telemetry._version = "2.2";
    
    this.startTime = 0;
    this._defaultValue = {
        pdata:{
            id: "genie",
            var: "6.5.2567",
            pid: ""
        },
        channel: "in.ekstep",
        uid: "anonymous",
        did: "",
        authtoken: "",
        sid: "",
        batchsize: 20,
        mode: "play",
        host: "https://api.ekstep.in",
        endpoint: "/data/v3/telemetry",
        tags: [],
        cdata: [],
        apislug: "/action"
    }

    this.telemetry.start = function(config, contentId, contentVer, type, data) {        
        if(instance.init(config, contentId, contentVer, type)){
            var startEventObj = instance.getEvent('OE_START', data);
            instance.addEvent(startEventObj)

            // Required to calculate the time spent of content while generating OE_END
            Telemetry.startTime = startEventObj.ets;          
        }        
    }

    this.telemetry.impression = function(pageid, type, subtype, data) {
        if (undefined == pageid ||  undefined == type) {
            console.error('Invalid impression data');
            return;
        }
        var eksData = {
            "stageid": pageid,
            "stageto": (data && data.stageto) ? data.stageto : "",
            "type": type,
            "subtype": subtype ? subtype : ""
        };
        instance.addEvent(instance.getEvent('OE_NAVIGATE', eksData));
    }

    this.telemetry.interact = function(data) {
        if (!instance.hasRequiredData(data, ["type", "id"])) {
            console.error('Invalid interact data');
            return;
        }
        var eksData = {
            "stageid": data.extra.stageId ? data.extra.stageId.toString() : "",
            "type": data.type,
            "subtype": data.extra.subtype ? data.extra.subtype : "",
            "pos": data.extra.pos ? data.extra.pos : [],
            "id": data.id,
            "tid": data.extra.tid ? data.extra.tid : "",
            "uri": data.extra.uri ? data.extra.uri : "",
            "extype": "",
            "values": data.extra.values ? data.extra.values : []
        };
        instance.addEvent(instance.getEvent('OE_INTERACT', eksData));
    }

    this.telemetry.startAssessment = function(qid, data) {
        if (undefined == qid){
            console.error('Invalid interact data');
            return;
        }
        var eksData = {
            qid: qid,
            maxscore: data.maxscore || 1
        };
        return instance.getEvent('OE_ASSESS', eksData);
    },

    this.telemetry.endAssessment = function(assessStartEvent, data) {
        if (!instance.hasRequiredData(data, ["qtitle", "qdesc", "mmc", "mc"])) {
            console.error('Invalid end assessment data');
            return;
        }
        if (undefined == assessStartEvent) {
            console.error('Invalid end assessment data');
            return;
        }
        var resvalues = data.res ? [] : data.res;
        resvalues = Array.isArray(resvalues) ? resvalues.map(function(val) {
            val = ("object" == typeof val) ? val :{"0" : val};
            return val;
        }) : [];

        var endeks = Object.assign(assessStartEvent.edata.eks, {
            "score": data.score || 0,
            "pass": data.pass ? 'Yes' : 'No',
            "resvalues": resvalues,
            "uri": data.uri || "",
            "qindex": data.qindex || 0,
            "exlength": 0,
            "qtitle": data.qtitle,
            "qdesc": data.qdesc.substr(0,140),
            "mmc": data.mmc,
            "mc": data.mc,
            "length": Math.round(((new Date()).getTime() - assessStartEvent.ets ) / 1000)
        })
        instance.addEvent(instance.getEvent('OE_ASSESS', endeks));
    }

    this.telemetry.response= function(data) {
        if (!instance.hasRequiredData(data, ["target", "qid", "type"])) {
            console.error('Invalid response data');
            return;
        }
        var eksData = {
            "target": data.target,
            "qid": data.qid,
            "type": data.type,
            "state": data.state || "",
            "resvalues": data.values ? [] : data.values
        }
        instance.addEvent(instance.getEvent('OE_ITEM_RESPONSE', eksData));
    }
    
    this.telemetry.interrupt= function(data) {
        if (!instance.hasRequiredData(data, ["type"])) {
            console.error('Invalid interrupt data');
            return;
        }
        var eksData = {
            "type": data.type,
            "stageid": data.pageid || ''
        }
        instance.addEvent(instance.getEvent('OE_INTERRUPT', eksData));
    }
    
    this.telemetry.error = function(data) {
        if (!instance.hasRequiredData(data, ["err", "errtype"])) {
            console.error('Invalid error data');
            return;
        }
        var eksData = {
            "err": data.err, 
            "type": data.errtype,
            "env": data.env || '', 
            "stacktrace": data.stacktrace, 
            "stageid": data.stageId || '', 
            "objecttype": data.objectType || '', 
            "objectid": data.objectId || '', 
            "action": data.action || '', 
            "data": data.data || '', 
            "severity": data.severity || ''
        }
        instance.addEvent(instance.getEvent('OE_ERROR', eksData));
    }

    this.telemetry.end = function(data) {
      var eksData = {
        "progress": data.progress || 50,
        "stageid": data.pageid || '',
        "length": (((new Date()).getTime() - Telemetry.startTime) / 1000)
      };
     
      instance.addEvent(instance.getEvent('OE_END', eksData));
      Telemetry.initialized = false;
    }

    this.telemetry.exdata = function(type, data) {
        instance.getEvent('OE_XAPI', {
            "xapi": data
        });
        instance.addEvent(instance.getEvent('OE_XAPI', eksData));
    }
    
    this.telemetry.assess = function(data) {
        console.log("This method comes in V3 release");
    }

    this.telemetry.feedback = function(data) {
        console.log("This method comes in V3 release");
    }

    this.telemetry.share = function(data) {
        console.log("This method comes in V3 release");
    }

    this.telemetry.log = function(data) {
        console.log("This method comes in V3 release");
    }

    this.telemetry.search = function(data) {
        console.log("This method comes in V3 release");
    }

    instance.init = function(config, contentId, contentVer, type){
        if(Telemetry.initialized){
            console.log("Telemetry is already initialized..");
            return false;
        }

        var requiredData = Object.assign(config, {"contentId": contentId, "contentVer": contentVer, "type": type});

        if (!instance.hasRequiredData(requiredData, ["contentId", "contentVer", "pdata", "channel", "uid", "authtoken"])) {
            console.error('Invalid start data');
            Telemetry.initialized = false;
            return Telemetry.initialized;
        }

        _defaultValue.gdata = {
            "id": contentId,
            "ver": contentVer
        }
        config.batchsize = config.batchsize ? (config.batchsize < 10 ? 10 : (config.batchsize > 1000 ? 1000 : config.batchsize)) : _defaultValue.batchsize;
        Telemetry.config = Object.assign(_defaultValue, config);
        Telemetry.initialized = true;
        //pid is rquired for V3 spec. Hence we are deleting from pdata of V2.
        if(Telemetry.config.pdata.pid != undefined)
            delete Telemetry.config.pdata.pid;

        return Telemetry.initialized;
    }

    instance.getEvent = function(eventId, data) {
        var eventObj = {
            "eid": eventId,
            "ver": Telemetry._version,
            "mid": "",
            "ets": (new Date()).getTime(),
            "channel": Telemetry.config.channel,
            "pdata": Telemetry.config.pdata,
            "gdata": Telemetry.config.gdata,
            "cdata": Telemetry.config.cdata, //TODO: No correlation data as of now. Needs to be sent by portal in context
            "uid": Telemetry.config.uid, // uuid of the requester
            "sid": Telemetry.config.sid,
            "did": Telemetry.config.did,
            "edata": { "eks": data },
            "etags": {
                "partner": Telemetry.config.tags
            }
          }
        return eventObj;
    }

    instance.addEvent = function(telemetryEvent){
        if(Telemetry.initialized){
            telemetryEvent.mid = 'OE_' + CryptoJS.MD5(JSON.stringify(telemetryEvent)).toString();
            var customEvent = new CustomEvent('TelemetryEvent', {detail: telemetryEvent});
            console.log("Telemetry Event ", telemetryEvent);
            document.dispatchEvent(customEvent);
        }else{
          console.log("Telemetry is not initialized. Please start Telemetry to log events.");
        }
    }

    instance.hasRequiredData = function(data, mandatoryFields) {
        var isValid = true;
        mandatoryFields.forEach(function(key) {
            if (!data.hasOwnProperty(key)) isValid = false;
        });
        return isValid;
    }

    instance.objectAssign = function(){      
      Object.assign = function (target) {
        'use strict';
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      }
    }

    if (typeof Object.assign != 'function') {
      objectAssign();
    }

    return this.telemetry;
})();

/**
 * This is responsible for syncing of Telemetry
 * @class TelemetrySyncManager
 * @author Krushanu Mohapatra <Krushanu.Mohapatra@tarento.com>
 */

var TelemetrySyncManager = {

    /**
    * This is the telemetry data for the perticular stage.
    * @member {object} _teleData
    * @memberof TelemetryPlugin
    */
    _teleData: [],
    init: function(){
        var instance = this;
        document.addEventListener('TelemetryEvent', this.sendTelemetry);
    },
    sendTelemetry: function(event) {
        var telemetryEvent = event.detail;
        var instance = TelemetrySyncManager;
        instance._teleData.push(telemetryEvent);
        if((telemetryEvent.eid.toUpperCase() == "OE_END") || (instance._teleData.length >= Telemetry.config.batchsize)) {
            var telemetryData = instance._teleData;
            var telemetryObj = {
                "id": "ekstep.telemetry",
                "ver": Telemetry._version,
                "ets": (new Date()).getTime(),
                "events": telemetryData
            };
            var headersParam = {};
            if ('undefined' != typeof Telemetry.config.authtoken)
                headersParam["Authorization"] = 'Bearer ' + Telemetry.config.authtoken;

            var fullPath = Telemetry.config.host + Telemetry.config.apislug + Telemetry.config.endpoint;
            headersParam['dataType'] = 'json';
            headersParam["Content-Type"] = "application/json";
            jQuery.ajax({
                url: fullPath,
                type: "POST",
                headers: headersParam,
                data: JSON.stringify(telemetryObj)
            }).done(function(resp) {
                instance._teleData = [];
                console.log("Telemetry API success", resp);
            }).fail(function(error, textStatus, errorThrown) {
                if (error.status == 403) {
                    console.error("Authentication error: ", error);
                } else {
                    console.log("Error while Telemetry sync to server: ", error);
                }
            });
        }
    }
}
TelemetrySyncManager.init();