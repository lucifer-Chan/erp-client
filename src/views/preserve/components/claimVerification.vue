<template>
    <el-dialog
        title="理赔审核"
        :visible.sync="show"
        class="dialog-outer detail-dialog"
        @close="setScroll"
    >
        <div class="dialog-body">

            <el-button type="primary" @click="download" style="margin-bottom: 15px;">批量下载图片资料</el-button>
            <el-card class="box-card">
                <div slot="header" class="el-card-header">
                    <span>报案情况</span>
                </div>
                <el-button type="text" disabled v-show="claimInfo.reported == 1">已报案</el-button>
                <el-button type="primary" :disabled="readonly" v-show="claimInfo.reported != 1" @click="setReportFlag">标记为已报案</el-button>
                <p>理赔单号： {{claimInfo.claimOrder}}</p>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="el-card-header">
                    <span>保单资料</span>
                </div>
                <el-form
                    :inline="true"
                    class="dialog-form"
                    label-width="150px"
                >
                    <el-form-item class="dialog-form-item w50p" label="保单号">
                        <span>{{policyInfo.policySn}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="产品名称">
                        <span>{{policyInfo.productName}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="投保人姓名">
                        <span>{{policyInfo.holderName}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="投保人身份证号">
                        <span>{{policyInfo.holderCardValue}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="被保人姓名">
                        <span>{{policyInfo.insuredName}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="被保人身份证号">
                        <span>{{policyInfo.insuredCardValue}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="代理人手机号" v-if="isInner">
                        <span>{{policyInfo.agentMobile}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="出单日期">
                        <span>{{policyInfo.insureSuccessTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="保险起期">
                        <span>{{policyInfo.validStartTime | parseTime('{y}-{m}-{d}')}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="保险止期">
                        <span>{{policyInfo.validEndTime | parseTime('{y}-{m}-{d}')}}</span>
                    </el-form-item>
                    <!--<el-form-item class="dialog-form-item w100p" :label="claimInfoExtend.bankCardType | bankCardType" v-if="claimInfoExtend && claimInfoExtend.bankCardImg">-->
                        <!--<div @click="showImg(img)" v-for="img in claimInfoExtend.bankCardImg.split(',')" class="img-outer" :style="{-->
                              <!--'background-image': 'url(' + img + ')'-->
                            <!--}"></div>-->
                    <!--</el-form-item>-->
                    <!--<el-form-item class="dialog-form-item w50p" label="开户行" v-if="claimInfoExtend && claimInfoExtend.depositBank">-->
                        <!--<span>{{(claimInfoExtend.bankName || '') + claimInfoExtend.depositBank}}</span>-->
                    <!--</el-form-item>-->
                </el-form>

            </el-card>

            <el-card class="box-card">
                <div slot="header" class="el-card-header">
                    <span>理赔资料</span>
                </div>

                <el-form
                    :inline="true"
                    class="dialog-form"
                    label-width="150px"
                >
                    <el-form-item class="dialog-form-item w50p" label="出险时间">
                        <span>{{claimInfo.injuredTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                    </el-form-item>
                    <!--<el-form-item class="dialog-form-item w50p" label="出险地点">-->
                        <!--<span>{{claimInfo.injuredPlace}}</span>-->
                    <!--</el-form-item>-->

                    <el-form-item class="dialog-form-item w100p" label="出险原因及经过">
                        <span>{{claimInfo.injuredReason}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item" label=" " v-if="claimCheckList.length > 0">
                        <el-radio-group class="sh-radio-group" :disabled="readonly" v-model="claimCheckList[0].status">
                            <el-radio :label="1">审核通过</el-radio>
                            <el-radio :label="0">审核不通过</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w50p" label="" v-if="claimCheckList.length > 0">
                        <el-input v-show="claimCheckList[0].status == 0" class="card-input-half" :disabled="readonly" v-model="claimCheckList[0].reason" placeholder="请输入不通过原因"></el-input>
                    </el-form-item>

                    <el-form-item class="dialog-form-item w100p" label="所属保障权益" :readonly="readonly">
                        <!--<el-checkbox-group disabled style="display: inline-block;margin-right: 1rem;">-->
                            <el-checkbox v-for="type in claimTypeList" disabled :checked="type.checked == 1" :label="type.claimTypeName" :key="type.claimTypeId"></el-checkbox>
                        <!--</el-checkbox-group>-->
                    </el-form-item>

                    <!--银行卡或存折-->
                    <template v-if="claimInfoExtend && claimInfoExtend.bankCardImg">
                        <el-form-item class="dialog-form-item w100p" label="银行" v-if="claimInfoExtend.bankName">
                            <span>{{claimInfoExtend.bankName}}</span>
                        </el-form-item>
                        <el-form-item class="dialog-form-item w100p" label="开户行" v-if="claimInfoExtend.depositBank">
                            <span>{{claimInfoExtend.bankArea + claimInfoExtend.depositBank}}</span>
                        </el-form-item>
                        <el-form-item class="dialog-form-item w100p content-full" :label="claimInfoExtend.bankCardType | bankCardType">
                            <div @click="showImg(img)" v-for="img in claimInfoExtend.bankCardImg.split(',')" class="img-outer" :style="{
                              'background-image': 'url(' + img + ')'
                            }"></div>
                        </el-form-item>
                        <el-form-item class="dialog-form-item" label=" ">
                            <el-radio-group class="sh-radio-group" v-model="formData.bankCardImgStatus" :disabled="readonly">
                                <el-radio :label="1">审核通过</el-radio>
                                <el-radio :label="0">审核不通过</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item class="dialog-form-item w50p" label="" v-if="formData.bankCardImgStatus == 0">
                            <el-input class="card-input-half" v-model="formData.bankCardImgReason" placeholder="请输入不通过原因" :disabled="readonly"></el-input>
                        </el-form-item>
                    </template>

                    <!--claimCheckList-->
                    <template v-for="(item, index) in claimCheckList" v-if="index > 0">
                        <el-form-item class="dialog-form-item w100p content-full" :label="item.docName" v-if="item.imgUrls">
                            <div @click="showImg(img)" v-for="img in item.imgUrls.split(',')" class="img-outer" :style="{
                              'background-image': 'url(' + img + ')'
                            }"></div>
                        </el-form-item>
                        <el-form-item class="dialog-form-item" label=" ">
                            <el-radio-group class="sh-radio-group" v-model="item.status" :disabled="readonly">
                                <el-radio :label="1">审核通过</el-radio>
                                <el-radio :label="0">审核不通过</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item class="dialog-form-item w50p" label="" v-if="item.status == 0">
                            <el-input class="card-input-half" placeholder="请输入不通过原因" v-model="item.reason" :disabled="readonly"></el-input>
                        </el-form-item>
                    </template>
                </el-form>
            </el-card>

            <el-card class="box-card" v-if="!(readonly && claimCheckList[0].status === null)">
                <div slot="header" class="el-card-header">
                    <span>初审结果</span>
                </div>
                <el-form
                    :inline="true"
                    class="dialog-form"
                    label-width="150px"
                >
                    <el-form-item class="dialog-form-item w50p" label="理赔初审结果">
                        <span :class="{'c-red': finalResult.statusMsg === '审核不通过'}">{{finalResult.statusMsg}}</span>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w100p" label="初审不通过原因" v-if="finalResult.statusMsg === '审核不通过'">
                        <span class="c-red">{{finalResult.reason}}</span>
                    </el-form-item>

                </el-form>
            </el-card>

            <el-card class="box-card" v-show="finalResult.status == 1">
                <div slot="header" class="el-card-header">
                    <span>快递寄送</span>
                </div>
                <el-form
                    :inline="true"
                    class="dialog-form"
                    label-width="150px"
                >
                    <el-form-item class="dialog-form-item w100p" label="快递寄送">
                        <el-radio-group class="kd-radio-group" :disabled="readonly" v-model="formData.needExpress">
                            <el-radio :label="true">需要快递寄送</el-radio>
                            <el-radio :label="false">不需要快递寄送</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w100p" label="寄送材料" v-if="formData.needExpress && claimInfo.claimSupportType == 2">
                        <el-input type="textarea" v-model="formData.sendFiles" :disabled="readonly" autosize class="dialog-form-input" required placeholder="请输入寄送材料"></el-input>
                    </el-form-item>
                    <el-form-item class="dialog-form-item w100p" label="寄送地址" v-if="formData.needExpress && claimInfo.claimSupportType != 2">
                        <el-input type="textarea" v-model="formData.expressAddress" :disabled="readonly" autosize class="dialog-form-input" required placeholder="请输入寄送地址"></el-input>
                    </el-form-item>

                </el-form>
            </el-card>

            <el-card class="box-card">
                <div slot="header" class="el-card-header">
                    <span>操作记录</span>
                </div>
                <el-row>
                    <el-col :span="24"><span class="col-label">理赔提交时间:</span><span class="col-content">{{listInfo.applyTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></el-col>
                    <template v-for="item in auditRecordList">
                        <el-col v-if="item.operation == 1" :span="24"><span class="col-label">理赔初审时间:</span><span class="col-content">{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></el-col>
                        <el-col v-if="item.operation == 1" :span="24"><span class="col-label">理赔初审人员:</span><span class="col-content">{{item.auditUserName}}</span></el-col>

                        <el-col v-if="item.operation == 2" :span="24"><span class="col-label">理赔终审结束时间:</span><span class="col-content">{{item.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span></el-col>
                        <el-col v-if="item.operation == 2" :span="24"><span class="col-label">理赔终审结果:</span><span class="col-content">{{item.status | operationStatusValue}}</span></el-col>
                        <el-col v-if="item.operation == 2" :span="24"><span class="col-label">理赔跟踪人员:</span><span class="col-content">{{item.auditUserName}}</span></el-col>
                    </template>
                </el-row>
            </el-card>

        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取 消</el-button>
            <el-button v-if="!readonly" type="primary" @click="submit">理赔审核</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import Api from "@/api/preserve";

    export default {
        components: {
        },
        data() {
            return {
                name: '理赔审核',
                show: false,
                isInner: this.$store.getters.permissions.indexOf('INNER') > -1 ? true: false,
                readonly: false,
                listInfo: '',
                claimInfoExtend: '',
                claimCheckList: [],
                claimDocList: [],
                auditRecordList: [],
                claimInfo: '',
                claimTypeList: '',
                policyInfo: '',
                formData: {
                    claimInfoUuid: null, // uuid
                    checkList: [], // uuid
                    status: null, // 0:审核不通过；1：审核通过
                    checkFailedReason: null, // 理赔不通过原因
                    claimAmount: null, // 理赔金额
                    needExpress: null, // 是否需要快递
                    expressAddress: null, // 邮寄地址
                    sendFiles: null, // 寄送的材料
                    bankCardImgStatus: null, // 银行卡或存折审核状态
                    bankCardImgReason: null // 银行卡或存折审核失败原因
                }
            }
        },
        computed: {
            finalResult() {
                let reason = '',
                    status = 1,
                    statusMsg = '审核通过';
                for (const item of this.claimCheckList) {
                    if (item.status - 0 === 0) {
                        statusMsg = '审核不通过';
                        status = 0;
                        if (reason && item.reason) {
                            reason += ', '
                        }
                        reason += item.reason;
                    }
                }

                if (this.formData.bankCardImgStatus !== null && this.formData.bankCardImgStatus - 0 === 0 ) {
                    statusMsg = '审核不通过';
                    status = 0;
                    if (reason && this.formData.bankCardImgReason) {
                        reason += ', '
                    }
                    reason += this.formData.bankCardImgReason;
                }

                return {
                    reason,
                    status,
                    statusMsg
                }
            }
        },
        methods: {
            showDialog(data, listInfo) {
                for (const item of data.claimTypeList) {
                    if (item.checked === 1) {
                        item.checkModel = [item.claimTypeName]
                    } else {
                        item.checkModel = [];
                    }
                }

                let sendFiles = '';

                // 理赔资料
                if (data.claimInfo.status !== 12 && (!data.claimCheckList || data.claimCheckList.length === 0)) {
                    this.readonly = false;
                    data.claimCheckList = [{
                        checkType: 0,
                        claimInfoId: data.claimInfo.id,
                        status: null,
                        reason: '',
                        docName: '出险原因及经过'
                    }];
                    for (const item of data.claimDocList) {
                        if (!item.imgUrls) {
                            continue
                        }
                        const check = {
                            checkType: 1,
                            claimDocId: item.id,
                            claimInfoId: data.claimInfo.id,
                            status: null,
                            reason: '',
                            imgUrls: item.imgUrls,
                            docName: item.docName
                        }
                        data.claimCheckList.push(check);

                        if (sendFiles) {
                            sendFiles += ',';
                        }
                        sendFiles += item.docName
                    }
                } else if (data.claimInfo.status === 12) { // 查看
                    this.readonly = true;
                    data.claimCheckList = [{
                        checkType: 0,
                        claimInfoId: data.claimInfo.id,
                        status: null,
                        reason: '',
                        docName: '出险原因及经过'
                    }];
                    for (const item of data.claimDocList) {
                        if (!item.imgUrls) {
                            continue
                        }
                        const check = {
                            checkType: 1,
                            claimDocId: item.id,
                            claimInfoId: data.claimInfo.id,
                            status: null,
                            reason: '',
                            imgUrls: item.imgUrls,
                            docName: item.docName
                        }
                        data.claimCheckList.push(check);
                    }

                } else {
                    this.readonly = true;
                    for (const item of data.claimCheckList) {
                        if (item.checkType === 1) {
                            for (const doc of data.claimDocList) {
                                if (doc.id === item.claimDocId) {
                                    item.imgUrls = doc.imgUrls;
                                    item.docName = doc.docName;
                                    break;
                                }
                            }
                        }
                    }
                    sendFiles = data.claimInfoExtend ? data.claimInfoExtend.sendFiles : null;
                }

                this.listInfo = listInfo;

                this.claimInfoExtend = data.claimInfoExtend;
                this.claimCheckList = data.claimCheckList;
                this.claimDocList = data.claimDocList;
                this.claimInfo = data.claimInfo;
                this.claimTypeList = data.claimTypeList;
                this.policyInfo = data.policyInfo;
                this.auditRecordList = data.auditRecordList;

                /* 对于理赔协助包括2.0之前的旧数据 claimInfo里面有个expressAddress 表示邮寄地址  如果这个有值的话 就表示勾选了快递寄送；
                 * 对于极速理赔 claimInfoExtend的needExpress=1表示需要寄送快递
                 * 理赔协助的expressAddress表示邮件地址  极速理赔的claimInfoExtend的sendFiles存放的是需要寄送的材料
                 * */
                this.formData.needExpress = (data.claimInfo.expressAddress || (data.claimInfoExtend && data.claimInfoExtend.needExpress)) ? true : data.claimInfo.status == 2 ? null : false;
//                this.formData.needExpress = data.claimInfoExtend ? data.claimInfoExtend.needExpress : null;
                this.formData.expressAddress = data.claimInfo.expressAddress;
                this.formData.bankCardImgStatus = data.claimInfoExtend ? data.claimInfoExtend.bankCardImgStatus : null;
                this.formData.bankCardImgReason = data.claimInfoExtend ? data.claimInfoExtend.bankCardImgReason : null;
                this.formData.sendFiles = sendFiles;

                this.show = true;
            },
            download() {
                window.location = process.env.BASE_API + '/claim/download?claimUuid=' + this.claimInfo.uuid;
            },
            showImg(url) {
                this.$emit('showImg', url)
            },
            setReportFlag() {
                const loading = this.$loading({
                    lock: true,
                    text: '正在标记为已报案...'
                });

                Api.setReportFlag({uuid: this.claimInfo.uuid}).then(rep => {
                    this.claimInfo.reported = 1;
                    loading.close();
                    this.$message({
                        message: '操作成功!',
                        type: 'success'
                    });
                }).catch(() => {
                    loading.close();
                })
            },
            getParams() {
                const params = this.formData;

                params.claimInfoUuid = this.claimInfo.uuid;
                params.status = this.finalResult.status;
                params.checkFailedReason = this.finalResult.reason;

                if (params.status === 1) { // 审核通过
                    if (!params.needExpress) {
                        params.sendFiles = null;
                        params.expressAddress = null;
                    } else if (this.claimInfo.claimSupportType == 2) {
                        params.expressAddress = null;
                    } else if (this.claimInfo.claimSupportType != 2) {
                        params.sendFiles = null;
                    }
                } else { // 审核不通过
                    params.sendFiles = null;
                    params.expressAddress = null;
                    params.sendFiles = null;
                }

                params.checkList = this.claimCheckList;

                for (const item of params.checkList) {
                    if (item.status === 1) {
                        item.reason = '';
                    }
                }
                console.log('params', params);

                return params;
            },
            submit() {

                if( this.claimInfoExtend && this.claimInfoExtend.bankCardImg) {
                    if (this.formData.bankCardImgStatus === null) {
                        this.$message({ message: '请先审核' + (this.claimInfoExtend.bankCardType - 0 === 1 ? '银行卡' : '存折'), type: 'error'})
                        return;
                    }
                    if (this.formData.bankCardImgStatus - 0 === 0 && !this.formData.bankCardImgReason) {
                        this.$message({ message: '请先输入' + (this.claimInfoExtend.bankCardType - 0 === 1 ? '银行卡' : '存折') + '审核不通过原因', type: 'error'})
                        return;
                    }
                }

                for (const item of this.claimCheckList) {
                    if (item.status === null) {
                        this.$message({ message: '请先审核' + item.docName, type: 'error' })
                        return;
                    }
                    if (item.status - 0 === 0 && !item.reason) {
                        this.$message({ message: '请先输入' + item.docName + '审核不通过原因', type: 'error' })
                        return;
                    }
                }

                if (this.finalResult.status === 1) {
                    if (this.formData.needExpress === null) {
                        this.$message({ message: '请选择是否需要快递寄送', type: 'error' })
                        return;
                    }
                    if (this.formData.needExpress === true) {
                        if (this.claimInfo.claimSupportType == 2 && !this.formData.sendFiles) {
                            this.$message({ message: '请输入寄送材料', type: 'error' })
                            return;
                        }
                        if (this.claimInfo.claimSupportType != 2 && !this.formData.expressAddress) {
                            this.$message({ message: '请输入寄送地址', type: 'error' })
                            return;
                        }
                    }
                }
                const params = this.getParams();

                const loading = this.$loading({
                    lock: true,
                    text: '正在提交审核...'
                });

                Api.submitFirstCheckResult(params).then(() => {
                    this.show = false;
                    loading.close();
                    this.$message({
                        message: '操作成功!',
                        type: 'success'
                    });
                    this.$emit('refresh');
                }).catch(() => {
                    loading.close()
                })
            },
            setScroll() {
                this.$el.scrollTop = 0;
            }
        }
    }
</script>

<style scoped lang="scss">
    .w50p{
        width: 48%;
    }
    .w100p{
        width: 100%;
    }

    .col-label{
        display: inline-block;
        width: 150px;
        /*text-align: right;*/
        padding-right: 15px;
    }

    .bank-card{
        height: 100px;
        width: 150px;
        display: inline-block;
        margin: 0 20px 0 0;
    }
    .sh-radio-group{
        width: 13rem;
    }
    .kd-radio-group{
        width: 20rem;
    }

    .img-outer{
        display: inline-block;
        margin-right: 15px;
        height: 100px;
        width: 150px;
        background-size: cover;
        background-position: 50%;
        background-repeat: no-repeat;
        border-radius: 4px;
        border: 1px solid #20a0ff;
    }
    .c-red{
        color: red;
    }
</style>