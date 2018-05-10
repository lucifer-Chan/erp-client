import Mock from 'mockjs';
import loginAPI from './login';
import claimAPI from './claim';


// 登录相关
Mock.mock(/\/userManager\/login/, 'get', loginAPI.login);
Mock.mock(/\/userManager\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/userManager\/getLoginStatus/, 'get', loginAPI.getUserInfo);
Mock.mock(/\/getUserInfo/, 'get', loginAPI.getUserInfo);
// Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getInfo)

// // 理赔列表
// Mock.mock(/\/claim\/admin\/getClaimList/, 'post', claimAPI.getList);
// Mock.mock(/\/claim\/admin\/getEvaluationList/, 'post', claimAPI.getList);
// Mock.mock(/\/claim\/admin\/getComplaintList/, 'post', claimAPI.getList);
// Mock.mock(/\/claim\/admin\/getClaimDetail/, 'post', claimAPI.getDetail);
// Mock.mock(/\/claim\/admin\/listProducts/, 'post', claimAPI.getListProducts);

export default Mock;
