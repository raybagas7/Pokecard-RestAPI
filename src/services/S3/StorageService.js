const AWS = require('aws-sdk');
const { Pool } = require('pg');
const NotFoundError = require('../../exceptions/NotFoundError');
const config = require('../../utils/config');

class StorageService {
  constructor() {
    this._S3 = new AWS.S3();
    this._pool = new Pool();
  }

  writeFile(file, meta, ownerId) {
    const parameter = {
      Bucket: config.s3.bucketName,
      Key: `pp-${ownerId}`,
      Body: file._data,
      ContentType: meta.headers['content-type'],
    };

    return new Promise((resolve, reject) => {
      this._S3.upload(parameter, (error, data) => {
        if (error) {
          return reject(error);
        }

        return resolve(data.Location);
      });
    });
  }

  async addPPtoUser(userId, profileImageUrl) {
    const query = {
      text: 'UPDATE users SET profile_img = $1 WHERE id = $2',
      values: [profileImageUrl, userId],
    };

    await this._pool.query(query);
  }
}

module.exports = StorageService;
