var camera = {
    'pictureSource'  : null,
    'destinationType': null,
    initialize       : function () {
        this.pictureSource = navigator.camera.PictureSourceType;
        this.destinationType = navigator.camera.DestinationType;
    },
    //sourceType 0:Photo Library, 1=Camera, 2=Saved Album
    //encodingType 0=JPG 1=PNG
    capturePhoto     : function (successCallback, failCallback) {
        if (!navigator.camera) {
            console.log("Camera API not supported", "Error");
            return false;
        }
        navigator.camera.getPicture(
            successCallback,
            failCallback,
            {
                quality: 50,
                allowEdit: false,
                destinationType: this.destinationType.DATA_URL
            }
        );

        return true;
    },
    browsePhoto      : function (successCallback, failCallback) {
        console.log("browsePhoto");
        if (!navigator.camera) {
            console.log("Camera API not supported", "Error");
            return false;
        }
        navigator.camera.getPicture(
            successCallback,
            failCallback,
            {
                quality          : 50,
                destinationType: this.destinationType.DATA_URL,
                sourceType     : this.pictureSource.PHOTOLIBRARY
            }
        );

        return true;
    }
};

var barcode = {
    'inst' : null,
    initialize : function () {
        this.inst = cordova.plugins.barcodeScanner;
    },
    scan : function (successCallback, errorCallback) {
        if (!this.inst) {
            console.log("barcode API not supported", "Error");
            return false;
        }
        this.inst.scan(successCallback, errorCallback);
    }
};

var app = {

    initialize: function () {
        this.bindEvents();
    },

    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function () {
        console.log('Received Event: ');
        camera.initialize();
        barcode.initialize();
    }
};


app.initialize();

var angularApp = angular.module('quickApp', ['ionic']);

