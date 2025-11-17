<template>
  <div class="diagnosis-view" :class="{ dark: appStore.isDarkMode }">
    <!-- 页面标题 -->
    <div class="page-header" v-motion-fade>
      <h1 class="page-title">智能诊断</h1>
      <p class="page-subtitle">基于大模型的中医智能诊断系统</p>
    </div>
    
    <!-- 诊断流程步骤 -->
    <div class="diagnosis-steps">
      <el-steps :active="currentStep" finish-status="success" class="steps-container">
        <el-step title="基本信息" icon="User" />
        <el-step title="症状描述" icon="Edit" />
        <el-step title="四诊信息" icon="Search" />
        <el-step title="智能诊断" icon="MostlyCloudy" />
        <el-step title="治疗方案" icon="MagicStick" />
      </el-steps>
    </div>
    
    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 步骤1: 基本信息 -->
      <div v-if="currentStep === 0" class="step-panel" v-motion-slide-up>
        <div class="panel-header">
          <h2>患者基本信息</h2>
          <p>请填写您的基本信息，以便进行更准确的诊断</p>
        </div>
        
        <el-form :model="patientInfo" label-width="100px" class="patient-form">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="姓名">
                <el-input v-model="patientInfo.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别">
                <el-radio-group v-model="patientInfo.gender">
                  <el-radio label="male">男</el-radio>
                  <el-radio label="female">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="年龄">
                <el-input-number 
                  v-model="patientInfo.age" 
                  :min="1" 
                  :max="120" 
                  placeholder="请输入年龄"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职业">
                <el-select v-model="patientInfo.occupation" placeholder="请选择职业">
                  <el-option label="学生" value="student" />
                  <el-option label="上班族" value="office" />
                  <el-option label="自由职业" value="freelance" />
                  <el-option label="退休" value="retired" />
                  <el-option label="其他" value="other" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="既往病史">
            <el-input 
              v-model="patientInfo.medicalHistory" 
              type="textarea" 
              :rows="3"
              placeholder="请描述既往病史、过敏史等重要信息"
            />
          </el-form-item>
          
          <el-form-item label="体质类型">
            <el-select v-model="patientInfo.constitution" placeholder="请选择体质类型">
              <el-option label="平和质" value="balanced" />
              <el-option label="气虚质" value="qi_deficiency" />
              <el-option label="阳虚质" value="yang_deficiency" />
              <el-option label="阴虚质" value="yin_deficiency" />
              <el-option label="痰湿质" value="phlegm_damp" />
              <el-option label="湿热质" value="damp_heat" />
              <el-option label="血瘀质" value="blood_stasis" />
              <el-option label="气郁质" value="qi_stagnation" />
              <el-option label="特禀质" value="special" />
              <el-option label="不清楚" value="unknown" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 步骤2: 症状描述 -->
      <div v-if="currentStep === 1" class="step-panel" v-motion-slide-up>
        <div class="panel-header">
          <h2>症状描述</h2>
          <p>请详细描述您的主要症状和不适感受</p>
        </div>
        
        <el-form :model="symptomInfo" label-width="120px" class="symptom-form">
          <el-form-item label="主要症状">
            <el-select
              v-model="symptomInfo.mainSymptoms"
              multiple
              placeholder="请选择主要症状"
              style="width: 100%"
            >
              <el-option label="头痛" value="headache" />
              <el-option label="头晕" value="dizziness" />
              <el-option label="发热" value="fever" />
              <el-option label="咳嗽" value="cough" />
              <el-option label="咽痛" value="sore_throat" />
              <el-option label="胸闷" value="chest_tightness" />
              <el-option label="心悸" value="palpitations" />
              <el-option label="失眠" value="insomnia" />
              <el-option label="食欲不振" value="poor_appetite" />
              <el-option label="腹胀" value="abdominal_distension" />
              <el-option label="便秘" value="constipation" />
              <el-option label="腹泻" value="diarrhea" />
              <el-option label="腰膝酸软" value="sore_waist_knees" />
              <el-option label="四肢乏力" value="limb_weakness" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="症状描述">
            <el-input 
              v-model="symptomInfo.description" 
              type="textarea" 
              :rows="4"
              placeholder="请详细描述您的症状，包括发病时间、严重程度、诱发因素等"
            />
          </el-form-item>
          
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="发病时间">
                <el-date-picker
                  v-model="symptomInfo.onsetTime"
                  type="date"
                  placeholder="选择发病日期"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="严重程度">
                <el-rate v-model="symptomInfo.severity" :max="10" show-score />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="伴随症状">
            <el-select
              v-model="symptomInfo.accompanyingSymptoms"
              multiple
              placeholder="请选择伴随症状"
              style="width: 100%"
            >
              <el-option label="恶心" value="nausea" />
              <el-option label="呕吐" value="vomiting" />
              <el-option label="出汗" value="sweating" />
              <el-option label="畏寒" value="chills" />
              <el-option label="发热" value="fever" />
              <el-option label="口干" value="dry_mouth" />
              <el-option label="口苦" value="bitter_taste" />
              <el-option label="口臭" value="bad_breath" />
              <el-option label="耳鸣" value="tinnitus" />
              <el-option label="听力下降" value="hearing_loss" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="诱发因素">
            <el-checkbox-group v-model="symptomInfo.triggeringFactors">
              <el-checkbox label="weather">天气变化</el-checkbox>
              <el-checkbox label="emotion">情绪波动</el-checkbox>
              <el-checkbox label="diet">饮食不当</el-checkbox>
              <el-checkbox label="fatigue">劳累过度</el-checkbox>
              <el-checkbox label="sleep">睡眠不足</el-checkbox>
              <el-checkbox label="other">其他</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 步骤3: 四诊信息 -->
      <div v-if="currentStep === 2" class="step-panel" v-motion-slide-up>
        <div class="panel-header">
          <h2>四诊信息</h2>
          <p>请提供望、闻、问、切四诊相关信息</p>
        </div>
        
        <el-form :model="examinationInfo" label-width="120px" class="examination-form">
          <!-- 望诊 -->
          <el-divider content-position="left">
            <el-icon><View /></el-icon>
            望诊信息
          </el-divider>
          
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="面色">
                <el-select v-model="examinationInfo.faceColor" placeholder="面色">
                  <el-option label="红润" value="ruddy" />
                  <el-option label="苍白" value="pale" />
                  <el-option label="潮红" value="flushed" />
                  <el-option label="萎黄" value="sallow" />
                  <el-option label="晦暗" value="dim" />
                  <el-option label="青紫" value="cyanotic" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="舌质">
                <el-select v-model="examinationInfo.tongueColor" placeholder="舌质">
                  <el-option label="淡红" value="pale_red" />
                  <el-option label="淡白" value="pale_white" />
                  <el-option label="红" value="red" />
                  <el-option label="绛" value="crimson" />
                  <el-option label="紫" value="purple" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="舌苔">
                <el-select v-model="examinationInfo.tongueCoating" placeholder="舌苔">
                  <el-option label="薄白" value="thin_white" />
                  <el-option label="薄黄" value="thin_yellow" />
                  <el-option label="厚白" value="thick_white" />
                  <el-option label="厚黄" value="thick_yellow" />
                  <el-option label="腻" value="greasy" />
                  <el-option label="少苔" value="scarce" />
                  <el-option label="无苔" value="none" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <!-- 闻诊 -->
          <el-divider content-position="left">
            <el-icon><Microphone /></el-icon>
            闻诊信息
          </el-divider>
          
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="声音">
                <el-select v-model="examinationInfo.voice" placeholder="声音">
                  <el-option label="正常" value="normal" />
                  <el-option label="低微" value="low" />
                  <el-option label="嘶哑" value="hoarse" />
                  <el-option label="重浊" value="heavy" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="呼吸">
                <el-select v-model="examinationInfo.breathing" placeholder="呼吸">
                  <el-option label="平稳" value="steady" />
                  <el-option label="急促" value="rapid" />
                  <el-option label="微弱" value="weak" />
                  <el-option label="喘促" value="wheezing" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <!-- 问诊 -->
          <el-divider content-position="left">
            <el-icon><ChatLineRound /></el-icon>
            问诊信息
          </el-divider>
          
          <el-row :gutter="24">
            <el-col :span="8">
              <el-form-item label="饮食">
                <el-select v-model="examinationInfo.appetite" placeholder="食欲">
                  <el-option label="正常" value="normal" />
                  <el-option label="不振" value="poor" />
                  <el-option label="亢进" value="excessive" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="睡眠">
                <el-select v-model="examinationInfo.sleep" placeholder="睡眠">
                  <el-option label="正常" value="normal" />
                  <el-option label="难入睡" value="hard_sleep" />
                  <el-option label="易醒" value="easy_wake" />
                  <el-option label="多梦" value="dreamy" />
                  <el-option label="失眠" value="insomnia" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="二便">
                <el-select v-model="examinationInfo.bowel" placeholder="二便">
                  <el-option label="正常" value="normal" />
                  <el-option label="便秘" value="constipation" />
                  <el-option label="腹泻" value="diarrhea" />
                  <el-option label="尿频" value="frequent_urine" />
                  <el-option label="尿少" value="scanty_urine" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          
          <!-- 切诊 -->
          <el-divider content-position="left">
            <el-icon><Pointer /></el-icon>
            切诊信息
          </el-divider>
          
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="脉象">
                <el-select v-model="examinationInfo.pulse" placeholder="脉象">
                  <el-option label="浮" value="floating" />
                  <el-option label="沉" value="deep" />
                  <el-option label="迟" value="slow" />
                  <el-option label="数" value="rapid" />
                  <el-option label="滑" value="slippery" />
                  <el-option label="涩" value="choppy" />
                  <el-option label="虚" value="empty" />
                  <el-option label="实" value="full" />
                  <el-option label="细" value="thin" />
                  <el-option label="洪" value="surging" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="腹部">
                <el-select v-model="examinationInfo.abdomen" placeholder="腹部">
                  <el-option label="柔软" value="soft" />
                  <el-option label="胀满" value="distended" />
                  <el-option label="疼痛" value="painful" />
                  <el-option label="拒按" value="resists_pressure" />
                  <el-option label="喜按" value="prefers_pressure" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      
      <!-- 步骤4: 智能诊断 -->
      <div v-if="currentStep === 3" class="step-panel" v-motion-slide-up>
        <div class="panel-header">
          <h2>智能诊断</h2>
          <p>AI系统正在分析您的症状信息...</p>
        </div>
        
        <div v-if="diagnosisLoading" class="diagnosis-loading">
          <el-icon class="loading-icon" size="64" color="var(--tcm-primary)">
            <Loading />
          </el-icon>
          <h3>正在分析诊断...</h3>
          <p>请稍候，AI系统正在根据中医理论分析您的症状</p>
          <div class="loading-tips">
            <el-alert
              v-for="tip in diagnosisTips"
              :key="tip"
              :title="tip"
              type="info"
              :closable="false"
              class="tip-item"
            />
          </div>
        </div>
        
        <div v-else-if="diagnosisResult" class="diagnosis-result">
          <el-card class="result-card" v-motion-pop>
            <template #header>
              <div class="card-header">
                <el-icon size="24" color="var(--tcm-success)">
                  <CircleCheck />
                </el-icon>
                <span>诊断结果</span>
              </div>
            </template>
            
            <div class="diagnosis-content">
              <div class="diagnosis-item">
                <h4>证型分析</h4>
                <p>{{ diagnosisResult.syndrome }}</p>
              </div>
              
              <div class="diagnosis-item">
                <h4>病因病机</h4>
                <p>{{ diagnosisResult.pathogenesis }}</p>
              </div>
              
              <div class="diagnosis-item">
                <h4>病位</h4>
                <el-tag v-for="location in diagnosisResult.location" :key="location">
                  {{ location }}
                </el-tag>
              </div>
              
              <div class="diagnosis-item">
                <h4>病性</h4>
                <el-tag v-for="nature in diagnosisResult.nature" :key="nature" type="warning">
                  {{ nature }}
                </el-tag>
              </div>
              
              <div class="diagnosis-item">
                <h4>诊断依据</h4>
                <ul>
                  <li v-for="evidence in diagnosisResult.evidence" :key="evidence">
                    {{ evidence }}
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      
      <!-- 步骤5: 治疗方案 -->
      <div v-if="currentStep === 4" class="step-panel" v-motion-slide-up>
        <div class="panel-header">
          <h2>治疗方案</h2>
          <p>根据诊断结果，为您制定个性化治疗方案</p>
        </div>
        
        <div v-if="treatmentPlan" class="treatment-content">
          <!-- 中药处方 -->
          <el-card class="treatment-card" v-motion-slide-up>
            <template #header>
              <div class="card-header">
                <el-icon size="24" color="var(--tcm-primary)">
                  <DocumentCopy />
                </el-icon>
                <span>中药处方</span>
              </div>
            </template>
            
            <div class="prescription-content">
              <div class="prescription-name">
                <h3>{{ treatmentPlan.prescription.name }}</h3>
                <el-tag type="primary">{{ treatmentPlan.prescription.type }}</el-tag>
              </div>
              
              <div class="herb-list">
                <h4>组成药物</h4>
                <el-table :data="treatmentPlan.prescription.herbs" style="width: 100%">
                  <el-table-column prop="name" label="药名" width="120" />
                  <el-table-column prop="dosage" label="用量" width="80" />
                  <el-table-column prop="unit" label="单位" width="60" />
                  <el-table-column prop="function" label="功效" />
                </el-table>
              </div>
              
              <div class="usage">
                <h4>用法用量</h4>
                <p>{{ treatmentPlan.prescription.usage }}</p>
              </div>
            </div>
          </el-card>
          
          <!-- 生活调护 -->
          <el-card class="treatment-card" v-motion-slide-up :delay="100">
            <template #header>
              <div class="card-header">
                <el-icon size="24" color="var(--tcm-success)">
                  <TrendCharts />
                </el-icon>
                <span>生活调护</span>
              </div>
            </template>
            
            <div class="lifestyle-content">
              <div class="lifestyle-item">
                <h4>饮食建议</h4>
                <ul>
                  <li v-for="diet in treatmentPlan.lifestyle.diet" :key="diet">
                    {{ diet }}
                  </li>
                </ul>
              </div>
              
              <div class="lifestyle-item">
                <h4>起居调护</h4>
                <ul>
                  <li v-for="daily in treatmentPlan.lifestyle.daily" :key="daily">
                    {{ daily }}
                  </li>
                </ul>
              </div>
              
              <div class="lifestyle-item">
                <h4>情志调摄</h4>
                <ul>
                  <li v-for="emotion in treatmentPlan.lifestyle.emotion" :key="emotion">
                    {{ emotion }}
                  </li>
                </ul>
              </div>
            </div>
          </el-card>
          
          <!-- 预后评估 -->
          <el-card class="treatment-card" v-motion-slide-up :delay="200">
            <template #header>
              <div class="card-header">
                <el-icon size="24" color="var(--tcm-warning)">
                  <DataAnalysis />
                </el-icon>
                <span>预后评估</span>
              </div>
            </template>
            
            <div class="prognosis-content">
              <div class="prognosis-item">
                <h4>预后情况</h4>
                <el-tag :type="treatmentPlan.prognosis.type">
                  {{ treatmentPlan.prognosis.assessment }}
                </el-tag>
              </div>
              
              <div class="prognosis-item">
                <h4>注意事项</h4>
                <ul>
                  <li v-for="precaution in treatmentPlan.prognosis.precautions" :key="precaution">
                    {{ precaution }}
                  </li>
                </ul>
              </div>
              
              <div class="prognosis-item">
                <h4>复诊建议</h4>
                <p>{{ treatmentPlan.prognosis.followUp }}</p>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    
    <!-- 底部操作按钮 -->
    <div class="step-actions">
      <el-button 
        v-if="currentStep > 0" 
        @click="previousStep"
        size="large"
      >
        上一步
      </el-button>
      <el-button 
        v-if="currentStep < 4" 
        type="primary" 
        @click="nextStep"
        size="large"
        :loading="diagnosisLoading"
      >
        {{ currentStep === 3 ? '开始诊断' : '下一步' }}
      </el-button>
      <el-button 
        v-if="currentStep === 4" 
        type="success" 
        @click="saveDiagnosis"
        size="large"
      >
        保存诊断结果
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import {
  User,
  Edit,
  Search,
  MagicStick,
  View,
  Microphone,
  ChatLineRound,
  Pointer,
  Loading,
  CircleCheck,
  DocumentCopy,
  TrendCharts,
  DataAnalysis
} from '@element-plus/icons-vue'
import { useDiagnosisStore } from '@/stores/diagnosis'
import { useAppStore } from '@/stores/app'
import { TCMService } from '@/services/aiService'

const diagnosisStore = useDiagnosisStore()
const appStore = useAppStore()
const tcmService = new TCMService()

const currentStep = ref(0)
const diagnosisLoading = ref(false)
const diagnosisResult = ref<any>(null)
const treatmentPlan = ref<any>(null)

const patientInfo = reactive({
  name: '',
  gender: '',
  age: 30,
  occupation: '',
  medicalHistory: '',
  constitution: ''
})

const symptomInfo = reactive({
  mainSymptoms: [],
  description: '',
  onsetTime: null,
  severity: 5,
  accompanyingSymptoms: [],
  triggeringFactors: []
})

const examinationInfo = reactive({
  faceColor: '',
  tongueColor: '',
  tongueCoating: '',
  voice: '',
  breathing: '',
  appetite: '',
  sleep: '',
  bowel: '',
  pulse: '',
  abdomen: ''
})

const diagnosisTips = [
  '正在分析症状信息...',
  '结合中医理论进行辨证...',
  '生成个性化诊断方案...',
  '优化治疗建议...'
]

const nextStep = async () => {
  if (currentStep.value === 3) {
    await performDiagnosis()
  } else {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const performDiagnosis = async () => {
  diagnosisLoading.value = true
  
  try {
    // 构建症状描述
    const symptoms = [
      ...symptomInfo.mainSymptoms,
      symptomInfo.description,
      ...symptomInfo.accompanyingSymptoms
    ].filter(Boolean).join(', ')
    
    // 构建脉象和舌象信息
    const pulse = examinationInfo.pulse
    const tongue = `${examinationInfo.tongueColor} ${examinationInfo.tongueCoating}`.trim()
    
    // 创建诊断请求
    const diagnosisRequest = {
      symptoms,
      pulse,
      tongue,
      patientInfo: {
        age: patientInfo.age,
        gender: patientInfo.gender as 'male' | 'female',
        medicalHistory: patientInfo.medicalHistory
      }
    }
    
    // 调用store的startDiagnosis方法获取真实API的诊断结果
    const apiDiagnosisResult = await diagnosisStore.startDiagnosis(diagnosisRequest)
    
    // 将API返回的结果转换为界面需要的格式
    diagnosisResult.value = {
      syndrome: apiDiagnosisResult.syndromeType,
      pathogenesis: apiDiagnosisResult.diagnosis,
      location: extractLocation(apiDiagnosisResult.diagnosis),
      nature: extractNature(apiDiagnosisResult.diagnosis),
      evidence: apiDiagnosisResult.recommendations.slice(0, 4) // 取前4条建议作为诊断依据
    }
    
    // 调用store的generatePrescription方法获取处方，传递诊断结果作为参数
    const apiPrescriptionResult = await diagnosisStore.generatePrescription({
      syndrome: apiDiagnosisResult.syndromeType,
      diagnosis: apiDiagnosisResult.diagnosis,
      patientInfo: {
        age: patientInfo.age,
        gender: patientInfo.gender as 'male' | 'female',
        medicalHistory: patientInfo.medicalHistory
      }
    })
    
    // 将API返回的处方结果转换为界面需要的格式
    treatmentPlan.value = {
      prescription: {
        name: apiPrescriptionResult.summary,
        type: apiPrescriptionResult.treatmentPrinciple || '中医治疗',
        herbs: parseHerbs(apiPrescriptionResult.mainHerbs),
        usage: apiPrescriptionResult.preparation || '水煎服，每日1剂，分2次服用。'
      },
      lifestyle: {
        diet: apiPrescriptionResult.precautions.slice(0, 4),
        daily: ['保持规律作息，避免熬夜', '适当运动，如太极拳、八段锦'],
        emotion: ['保持心情舒畅，避免情绪波动', '学会放松技巧，如深呼吸、冥想']
      },
      prognosis: {
        assessment: '良好',
        type: 'success',
        precautions: apiPrescriptionResult.precautions.slice(0, 3),
        followUp: apiPrescriptionResult.duration || '建议1周后复诊'
      }
    }
    
    currentStep.value++
    ElMessage.success('诊断完成！')
  } catch (error) {
    console.error('Diagnosis error:', error)
    // 显示更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : '诊断失败，请稍后重试'
    ElMessage.error(errorMessage)
  } finally {
    diagnosisLoading.value = false
  }
}

// 辅助函数：从诊断文本中提取病位
const extractLocation = (diagnosisText: string): string[] => {
  // 简单的病位提取逻辑，可以根据需要优化
  const locations = ['心', '肝', '脾', '肺', '肾', '胆', '胃', '肠']
  return locations.filter(loc => diagnosisText.includes(loc))
}

// 辅助函数：从诊断文本中提取病性
const extractNature = (diagnosisText: string): string[] => {
  // 简单的病性提取逻辑，可以根据需要优化
  const natures = ['气虚', '血虚', '阴虚', '阳虚', '气滞', '血瘀', '痰湿', '湿热', '寒湿', '实热', '虚寒']
  return natures.filter(nature => diagnosisText.includes(nature))
}

// 辅助函数：解析药材信息
const parseHerbs = (herbTexts: string[]): Array<{name: string, dosage: number, unit: string, function: string}> => {
  return herbTexts.map(herbText => {
    // 尝试从文本中提取药材名称和剂量
    const match = herbText.match(/(\w+[\w\s]*?)[\s]*(\d+)[g克]/)
    if (match) {
      return {
        name: match[1].trim(),
        dosage: parseInt(match[2]),
        unit: 'g',
        function: '中药功效' // 可以进一步解析或使用默认值
      }
    }
    // 如果解析失败，返回默认值
    return {
      name: herbText,
      dosage: 6,
      unit: 'g',
      function: '中药功效'
    }
  })
}

const saveDiagnosis = () => {
  // 这里可以添加保存到本地存储或发送到服务器的逻辑
  ElMessage.success('诊断结果已保存！')
}
</script>

<style scoped>
.diagnosis-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #F5E6D3 0%, #FAF0E6 100%);
  padding: 40px 24px;
}

.diagnosis-view.dark {
  background: linear-gradient(135deg, #2f2f2f 0%, #3a3a3a 100%);
  color: #f5f5f5;
  transition: background 0.3s ease, color 0.3s ease;
}

.diagnosis-view.dark .page-title,
.diagnosis-view.dark .panel-header h2 {
  color: #f8e3c2;
}

.diagnosis-view.dark .page-subtitle,
.diagnosis-view.dark .panel-header p,
.diagnosis-view.dark .diagnosis-item p,
.diagnosis-view.dark .diagnosis-item li,
.diagnosis-view.dark .lifestyle-item li,
.diagnosis-view.dark .prognosis-item li {
  color: #e0d8cf;
}

.diagnosis-view.dark .diagnosis-steps,
.diagnosis-view.dark .step-panel,
.diagnosis-view.dark .diagnosis-result .result-card,
.diagnosis-view.dark .treatment-card {
  background: rgba(34, 34, 34, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
}

.diagnosis-view.dark .card-header,
.diagnosis-view.dark .prescription-name h3,
.diagnosis-view.dark .diagnosis-item h4,
.diagnosis-view.dark .lifestyle-item h4,
.diagnosis-view.dark .prognosis-item h4 {
  color: #f8e3c2;
}

.diagnosis-view.dark .step-actions .el-button {
  box-shadow: none;
}

.diagnosis-view.dark :deep(.el-form-item__label),
.diagnosis-view.dark :deep(.el-radio),
.diagnosis-view.dark :deep(.el-checkbox),
.diagnosis-view.dark :deep(.el-rate__text) {
  color: #e0d8cf;
}

.diagnosis-view.dark :deep(.el-input__wrapper),
.diagnosis-view.dark :deep(.el-select__wrapper),
.diagnosis-view.dark :deep(.el-textarea__inner),
.diagnosis-view.dark :deep(.el-date-editor),
.diagnosis-view.dark :deep(.el-rate) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f5f5f5;
}

.diagnosis-view.dark :deep(.el-input__inner),
.diagnosis-view.dark :deep(.el-select__placeholder),
.diagnosis-view.dark :deep(.el-textarea__inner),
.diagnosis-view.dark :deep(.el-date-editor input) {
  color: #f5f5f5;
}

.diagnosis-view.dark :deep(.el-select-dropdown),
.diagnosis-view.dark :deep(.el-popper) {
  background: #2f2f2f;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.diagnosis-view.dark :deep(.el-select-dropdown__item),
.diagnosis-view.dark :deep(.el-select-dropdown__item span) {
  color: #f5f5f5;
}

.diagnosis-view.dark :deep(.el-table),
.diagnosis-view.dark :deep(.el-table__header-wrapper),
.diagnosis-view.dark :deep(.el-table__body-wrapper) {
  background: transparent;
  color: #e0d8cf;
}

.diagnosis-view.dark :deep(.el-table th),
.diagnosis-view.dark :deep(.el-table tr),
.diagnosis-view.dark :deep(.el-table td) {
  background-color: transparent !important;
  color: #e0d8cf;
  border-color: rgba(255, 255, 255, 0.08);
}

.diagnosis-view.dark :deep(.el-alert) {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
  color: #e0d8cf;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--tcm-primary);
  margin: 0 0 16px 0;
}

.page-subtitle {
  font-size: 1.2rem;
  color: var(--tcm-secondary);
  margin: 0;
}

.diagnosis-steps {
  max-width: 1200px;
  margin: 0 auto 48px auto;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: var(--shadow-medium);
  border: 1px solid rgba(139, 69, 19, 0.1);
}

.steps-container {
  max-width: 1000px;
  margin: 0 auto;
}

.step-content {
  max-width: 1200px;
  margin: 0 auto;
}

.step-panel {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 48px;
  box-shadow: var(--shadow-medium);
  border: 1px solid rgba(139, 69, 19, 0.1);
  margin-bottom: 32px;
}

.panel-header {
  text-align: center;
  margin-bottom: 48px;
}

.panel-header h2 {
  font-size: 2rem;
  font-weight: 600;
  color: var(--tcm-primary);
  margin: 0 0 16px 0;
}

.panel-header p {
  font-size: 1.1rem;
  color: var(--tcm-secondary);
  margin: 0;
}

/* 表单样式 */
.patient-form,
.symptom-form,
.examination-form {
  max-width: 800px;
  margin: 0 auto;
}

.patient-form :deep(.el-form-item__label) {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
}

@media screen and (max-width: 768px) {
  .patient-form :deep(.el-row) {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .patient-form :deep(.el-col) {
    max-width: 100% !important;
    flex: 0 0 100% !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .patient-form :deep(.el-form-item) {
    flex-direction: column;
    align-items: flex-start;
  }

  .patient-form :deep(.el-form-item__label) {
    width: 100% !important;
    text-align: left;
    padding: 0 0 8px 0;
  }

  .patient-form :deep(.el-form-item__content) {
    width: 100%;
  }
}

/* 诊断加载 */
.diagnosis-loading {
  text-align: center;
  padding: 80px 0;
}

.loading-icon {
  animation: rotate 2s linear infinite;
  margin-bottom: 24px;
}

.diagnosis-loading h3 {
  font-size: 1.5rem;
  color: var(--tcm-primary);
  margin: 0 0 16px 0;
}

.diagnosis-loading p {
  font-size: 1.1rem;
  color: var(--tcm-secondary);
  margin: 0 0 32px 0;
}

.loading-tips {
  max-width: 600px;
  margin: 0 auto;
}

.tip-item {
  margin-bottom: 12px;
}

/* 诊断结果 */
.diagnosis-result {
  max-width: 800px;
  margin: 0 auto;
}

.result-card {
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--tcm-primary);
}

.diagnosis-content {
  padding: 24px 0;
}

.diagnosis-item {
  margin-bottom: 32px;
}

.diagnosis-item:last-child {
  margin-bottom: 0;
}

.diagnosis-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--tcm-primary);
  margin: 0 0 16px 0;
}

.diagnosis-item p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--tcm-secondary);
  margin: 0;
}

.diagnosis-item ul {
  margin: 0;
  padding-left: 20px;
}

.diagnosis-item li {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--tcm-secondary);
  margin-bottom: 8px;
}

.diagnosis-item li:last-child {
  margin-bottom: 0;
}

.diagnosis-item .el-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

/* 治疗方案 */
.treatment-content {
  max-width: 1000px;
  margin: 0 auto;
}

.treatment-card {
  border-radius: 16px;
  box-shadow: var(--shadow-medium);
  margin-bottom: 24px;
}

.prescription-content,
.lifestyle-content,
.prognosis-content {
  padding: 24px 0;
}

.prescription-name {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.prescription-name h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--tcm-primary);
  margin: 0;
}

.herb-list h4,
.usage h4,
.lifestyle-item h4,
.prognosis-item h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--tcm-primary);
  margin: 0 0 16px 0;
}

.lifestyle-item,
.prognosis-item {
  margin-bottom: 24px;
}

.lifestyle-item:last-child,
.prognosis-item:last-child {
  margin-bottom: 0;
}

.lifestyle-item ul,
.prognosis-item ul {
  margin: 0;
  padding-left: 20px;
}

.lifestyle-item li,
.prognosis-item li {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--tcm-secondary);
  margin-bottom: 8px;
}

.lifestyle-item li:last-child,
.prognosis-item li:last-child {
  margin-bottom: 0;
}

/* 步骤操作按钮 */
.step-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 48px;
  padding: 0 24px;
}

.step-actions .el-button {
  min-width: 120px;
  padding: 16px 32px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.step-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

/* 动画 */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media screen and (max-width: 1024px) {
  .step-panel {
    padding: 32px;
  }
  
  .patient-form,
  .symptom-form,
  .examination-form {
    padding: 0;
  }
}

@media screen and (max-width: 768px) {
  .diagnosis-view {
    padding: 24px 16px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .diagnosis-steps {
    padding: 24px;
  }
  
  .step-panel {
    padding: 24px;
  }
  
  .panel-header h2 {
    font-size: 1.5rem;
  }
  
  .step-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .step-actions .el-button {
    width: 200px;
  }
  
  .prescription-name {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media screen and (max-width: 480px) {
  .page-title {
    font-size: 1.8rem;
  }
  
  .step-panel {
    padding: 20px;
  }
  
  .diagnosis-loading {
    padding: 60px 0;
  }
  
  .loading-tips {
    padding: 0 16px;
  }
}
</style>