function create_zip() {
  var zip = new JSZip();
  var zipFilename = "super-legit.zip";
  var urls = [
    'https://s3.amazonaws.com/limbforge/EbeArm/Ebe_forearm_L/forearm_L_C4-200_L1-220.stl',  //works
    'https://s3-us-west-2.amazonaws.com/test-dcc67e4a-9949-42c3-9609-666e4dd87e48/disco.stl', //works
    'https://www.irs.gov/pub/irs-pdf/fw4.pdf', //works
    //"https://dtecho365.sharepoint.com/sites/Demo01/_api/Web/Lists(guid'09adb51e-b024-4c20-87ca-ebc3f31fa95a')/Items(1246)",
    //'https://dtecho365.sharepoint.com/:w:/r/sites/ServiceNowQA1/_layouts/15/Doc.aspx?sourcedoc=%7Bab3310c5-2bdb-4d68-9cdb-f0f630265add%7D',
    //'https://dtecho365.sharepoint.com/:b:/r/sites/Demo01/demo02lib/application.pdf?csf=1&web=1&e=wrucuT',
    'https://dtecho365.sharepoint.com/:b:/r/sites/Demo01/demo02lib/application.pdf?csf=1&download=1&e=wrucuT',
    'https://dtecho365.sharepoint.com/sites/ServiceNowDev1/_layouts/15/download.aspx?SourceUrl=%2Fsites%2FServiceNowDev1%2FDev1Lib2%2Fb3%2Epdf'


  ];

  var count = 0;
  // We're asynchronously asking for all of the files
  // We increment the count once each file is completely downloaded
  // Once the last file is downloaded (aka count == urls.length) then zip it and download it
  urls.forEach(function (url) {
    // Grab the filename from the url
    // For example if the url is http://google.com/awesome/foo.stl
    // We set filename = foo.stl
    var indexOfLastSlash = url.lastIndexOf('/');
    var filename = url.substring(indexOfLastSlash + 1);

    // Load a file from an external url and add it in a zip file
    // Beware! This will fail if the file is not binary
    // aka if it is a text file or an ascii stl model
    JSZipUtils.getBinaryContent(url, function (err, data) {
      if(err) {
        // Probably should do something better here...
        // For example if the file server is down, provide some kind of info to the user
        throw err;
      }

      // Add the file to the zip
      zip.file(filename, data, { binary: true });
      count++;

      // We're all done! Zip it and ship it
      if (count == urls.length) {
        zip.generateAsync({ type: "blob" })
        .then(function(zipFile) {
          saveAs(zipFile, zipFilename);
        });
      }
    });
  });
}

$( document ).ready(function() {
  $("#cool").click(function(){
    create_zip();
  });
});
