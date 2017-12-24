var _Environments = {
    production:  {BASE_URL: 'http://siddurcloud.com/siddur_admin/mobile/Api', API_KEY: ''},
    development: {BASE_URL: 'http://192.168.0.77/siddur_admin/mobile/Api', API_KEY: ''},
}

function getEnvironment(platform) {
    return _Environments[platform]
}

var Environment = getEnvironment('production')
module.exports = Environment