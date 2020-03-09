const fsm = uni.getFileSystemManager();
const FILE_BASE_NAME = 'tmp_base64src';

const base64src = function(base64data, fileName) {
  return new Promise((resolve, reject) => {
    const [, format, bodyData] = /data:image\/(\w+);base64,(.*)/.exec(base64data) || [];
    if (!format) {
      reject(new Error('ERROR_BASE64SRC_PARSE'));
    }
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName ? fileName : FILE_BASE_NAME}.${format}`;
    const buffer = uni.base64ToArrayBuffer(bodyData);
    fsm.writeFile({
      filePath,
      data: buffer,
      encoding: 'binary',
      success() {
        resolve(filePath);
      },
      fail(e) {
		console.log(e)
        reject(new Error('ERROR_BASE64SRC_WRITE'));
      },
    });
  });
};

export default base64src;