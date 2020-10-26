var woff2 = (function(f){
  return 'FontFace' in window && (f = new FontFace('t',
  'url("data:font/woff2;base64,d09GMgABAAAAAADwAAoAAAAAAiQAAACoAAEAAAAAAAAAAA'+
  'AAAAAAAAAAAAAAAAAABmAALAogOAE2AiQDBgsGAAQgBSAHIBuDAciO1EZ3I/mL5/+5/rfPnTt9'+
  '/9Qa8H4cUUZxaRbh36LiKJoVh61XGzw6ufkpoeZBW4KphwFYIJGHB4LAY4hby++gW+6N1EN94I'+
  '49v86yCpUdYgqeZrOWN34CMQg2tAmthdli0eePIwAKNIIRS4AGZFzdX9lbBUAQlm//f262/61o'+
  '8PlYO/D1/X4FrWFFgdCQD9DpGJSxmFyjOAGUU4P0qigcNb82GAAA") format("woff2")',
  {})).load()['catch'](function(){}) && f.status[0] == 'l';
})();
