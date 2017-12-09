var ws;
var id;

// Static data used on all pages
var userNames = [ "rice", "ziti", "pita", "veal", "lamb", "pork", "tuna", "corn", "ice", "cake", "tea", "pear",
          "fig", "date", "bean", "plum", "ragu", "soup", "beet", "spam", "fish", "oats", "chip",
          "yam", "egg", "fry", "pbj" ];
var allColorsDict = {"black": "black", "brown": "brown", "grey": "grey", "blue": "blue", "red": "red", "yellow": "yellow", "green": "green", "teal": "teal", "goldenrod": "goldenrod", "purple": "purple", "lime": "lime", "magenta": "magenta", "maroon": "maroon", "olive": "olive", "cornflower": "cornflower"};
var allColors = ["black", "brown", "grey", "blue", "red", "yellow", "green", "teal", "goldenrod", "purple", "lime", "magenta", "maroon", "olive", "cornflower"];
var links = ["http://adventofcode.com/", "https://www.khanacademy.org/computer-programming/comments-for-merry-christmas/4904371191087104", "https://www.khanacademy.org/computer-programming/comments-for-flat-devices/6667561700753408", "https://www.khanacademy.org/computer-programming/attempt-to-make-item-hover-in-decorate-your-own-christmas-tree/5657322713055232"];

var colorRequest = { 'action': 'color', 'color': 'white' };
var sizeRequest =  { 'action': 'size', 'factor': 1 };
var flipRequest =  { 'action': 'flip' };


function infoConsole(msg) {
  console.log('%c '+msg, 'background: #222; color: #bada55');
}
function warningConsole(msg) {
  console.log('%c '+msg, 'background: #222; color: #ff0000');
}

// Post welcome message with some instructions to the developer's console
function welcomeMessage(name, id) {
  infoConsole("Hello, "+name+", welcome to the console. Your user id is "+id+" ");
  infoConsole("Try typing \"allColors\" and hitting <Enter> to see the list containing all the color options ");
  infoConsole("This is also where you can send out requests for some mouse changes. Try \"send(flipRequest)\". ");
  infoConsole("There are also \"sizeRequest\" and \"colorRequest\". Enter any of those names here to see what that particular request object looks like. ");
}


function ratelimit(fn, ms) {
  var last = (new Date()).getTime();
  return (function() {
    var now = (new Date()).getTime();
    if (now - last > ms) {
      last = now;
      fn.apply(null, arguments);
    }
  });
}

function move(mouse){
  var moveId = mouse['id'];
  
  if($('#mouse_'+moveId).length == 0) {
    var mouseDiv;
    // Create div that shows name if it's not this page's user
    if(moveId == id) {
      mouseDiv = '<div class="mouse" id="mouse_'+moveId+'"><div class="overlay"></div></div>';
    } else {
      var name = userNames[moveId] || "U"+id;
      mouseDiv = '<div class="mouse" id="mouse_'+moveId+'"><div class="overlay"></div><div class="name">'+name+'</div></div>';
    }
    $('body').append(mouseDiv);
  }

  $('#mouse_'+moveId).css({
    'left' : (($(window).width() - mouse['w']) / 2 + mouse['x']) + 'px',
    'top' : mouse['y'] + 'px'
  });
}

function send(req) {
  if (ws.readyState == WebSocket.OPEN) {
    ws.send(JSON.stringify(req));
  }
}

$(function() {
  var hostname = window.location.hostname;
  ws = new WebSocket("ws://"+hostname+":8080");
  ws.onmessage = function(evt) {
    data = JSON.parse(evt.data);

    if (!data['action']) { return; }

    // Put up message when the user has their mouse modified by another
    if (['color', 'size', 'flip'].indexOf(data['action']) !== -1 &&
      data['id'] === id && data['_from'] !== id) {
      warningConsole('WARNING - It appears you have been hacked. Your mouse was updated by user id '+data['_from']);
    }

    if (data['action'] == 'close') { 
       $('#mouse_'+data['id']).remove();
    }

    else if (data['action'] == 'setup'){
      id = data['id'];

      // Set defaults for all requests to modify current user
      colorRequest.id = id;
      colorRequest._from = id;
      sizeRequest.id = id;
      sizeRequest._from = id;
      flipRequest.id = id;
      flipRequest._from = id;


      // Display user's name in upper right
      var name = userNames[id] || "U"+id; 
      var namePlate = '<div id="user-name">You are user <b>'+name+'</b></div>';
      $('body').append(namePlate);

      welcomeMessage(name, id);
    }

    else if(data['action'] == 'move'){
      move(data);
    }

    else if (data['action'] == 'color'){
      var cursor = $('#mouse_'+data['id']);
      cursor.find('.overlay').css({ 'background-color': data['color']});
    }

    else if (data['action'] == 'size'){
         var cursor = $('#mouse_'+data['id']);
         var currentWidth = cursor.css('width');
         currentWidth = parseInt(currentWidth.substring(0, currentWidth.indexOf('px')));
         var factor = data['factor'];
         var newWidth = currentWidth*factor;
         var newHeight = parseInt(newWidth*1.6);
         cursor.css({ 'width': newWidth, 'height': newHeight });
    }

    else if (data['action'] == 'flip'){               
         var cursor = $('#mouse_'+data['id']);
         var currOrientation = cursor.css('-webkit-transform');
         if (currOrientation && currOrientation.indexOf('-1') != -1) {
             cursor.css({'-webkit-transform' : 'scaleY(1)'});
         } else {
             cursor.css({'-webkit-transform' : 'scaleY(-1)'});
         }
     }
   };

    $(document).mousemove(
      ratelimit(function(e){
        if (ws.readyState == WebSocket.OPEN) {
          ws.send(JSON.stringify({
            'action': 'move',
            'x': e.pageX,
            'y': e.pageY,
            'w': $(window).width(),
            'h': $(window).height(),
            'id': id
          }));
        }
      }, 20)
    );  
});
