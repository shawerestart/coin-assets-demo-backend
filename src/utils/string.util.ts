require('dotenv').config();
const getRandomString = (e: number) => {
  e = e || 32;
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = '';
  for (let i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
  return n;
};

const getFilenameAndExtension = (pathfilename) => {
  const filenameextension = pathfilename.replace(/^.*[\\\/]/, '');
  const filename = filenameextension.substring(
    0,
    filenameextension.lastIndexOf('.'),
  );
  const ext = filenameextension.split('.').pop();

  return [filename, ext];
};
export const apiUrl = (url: string) => `${process.env.API_URL}${url}`;

export { getRandomString, getFilenameAndExtension };
