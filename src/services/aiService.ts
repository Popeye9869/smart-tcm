import axios from 'axios'
import type { DiagnosisRequest, DiagnosisResponse, PrescriptionRequest, PrescriptionResponse } from '@/types/tcm'

// 大模型API配置
const API_CONFIG = {
  baseURL: 'https://api.moonshot.cn/v1', // Moonshot API地址
  apiKey: 'sk-fXqaFKApUvX2BX1cgQNAgCCOGR2JV7Z16MpUmqZyYKmwUE59',
  model: 'kimi-k2-0905-preview', // Moonshot模型
  timeout: 3000000 // 30秒超时
}

// 创建axios实例
const aiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.apiKey}`
  }
})

// 请求拦截器
aiClient.interceptors.request.use(
  (config) => {
    console.log('AI Request URL:', config.baseURL + config.url)
    console.log('AI Request Headers:', config.headers)
    console.log('AI Request Data:', config.data)
    return config
  },
  (error) => {
    console.error('AI Request Error:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
aiClient.interceptors.response.use(
  (response) => {
    console.log('AI Response Status:', response.status)
    console.log('AI Response Data:', response.data)
    return response
  },
  (error) => {
    console.error('AI Response Error:', error)
    console.error('Error Response:', error.response?.data)
    console.error('Error Status:', error.response?.status)
    console.error('Error Headers:', error.response?.headers)
    
    if (error.response?.status === 401) {
      throw new Error('API密钥无效，请检查配置')
    } else if (error.response?.status === 429) {
      throw new Error('请求过于频繁，请稍后再试')
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('请求超时，请检查网络连接')
    } else {
      throw new Error(`AI服务暂时不可用: ${error.message || '未知错误'}`)
    }
  }
)

export class TCMService {
  /**
   * 智能中医诊断
   */
  static async diagnose(request: DiagnosisRequest): Promise<DiagnosisResponse> {
    const { symptoms, pulse, tongue, patientInfo } = request
    
    const systemPrompt = `你是一位经验丰富的中医专家，擅长通过症状、脉象、舌象等信息进行中医诊断。
请根据患者提供的信息，按照中医理论进行分析和诊断。

诊断要求：
1. 分析病因病机
2. 判断证型
3. 给出中医诊断结论
4. 提供治疗建议
5. 推荐中药方剂
6. 给出生活调护建议

请以专业、详细、易懂的方式回答，确保诊断准确可靠。`

    const userPrompt = `患者信息：
年龄：${patientInfo.age}岁
性别：${patientInfo.gender}
既往病史：${patientInfo.medicalHistory || '无'}
过敏史：${patientInfo.allergies?.join(', ') || '无'}
当前用药：${patientInfo.currentMedications?.join(', ') || '无'}

症状描述：${symptoms}
脉象：${pulse || '未提供'}
舌象：${tongue || '未提供'}

请根据中医理论进行详细诊断。`

    try {
      const response = await aiClient.post('/chat/completions', {
        model: API_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7,
        stream: false
      })

      const diagnosisText = response.data.choices[0]?.message?.content || ''
      // 解析AI返回的诊断结果
      return this.parseDiagnosisResult(diagnosisText)
    } catch (error) {
      console.error('诊断失败:', error)
      throw error
    }
  }

  /**
   * 智能处方推荐
   */
  static async prescribe(request: PrescriptionRequest): Promise<PrescriptionResponse> {
    const { diagnosis, patientInfo } = request
    
    const systemPrompt = `你是一位经验丰富的中医师，擅长根据诊断结果开具中药处方。
请根据诊断结果，推荐合适的中药方剂，包括：

1. 主方推荐（包含具体药材和剂量）
2. 加减变化建议
3. 煎服方法
4. 注意事项
5. 疗程建议

请确保处方安全有效，剂量合理。`

    const userPrompt = `诊断结果：${diagnosis}
患者信息：${JSON.stringify(patientInfo, null, 2)}

请推荐合适的中药方剂。`

    try {
      const response = await aiClient.post('/chat/completions', {
        model: API_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 1500,
        temperature: 0.5,
        stream: false
      })

      const prescriptionText = response.data.choices[0]?.message?.content || ''
      
      return this.parsePrescriptionResult(prescriptionText)
    } catch (error) {
      console.error('处方生成失败:', error)
      throw error
    }
  }

  /**
   * 中医知识问答
   */
  static async askTCM(question: string): Promise<string> {
    const systemPrompt = `你是一位中医知识专家，精通中医理论、诊断、治疗、方剂等各个方面。
请准确、专业地回答用户关于中医的问题，回答要：

1. 基于中医理论
2. 准确可靠
3. 通俗易懂
4. 实用性强

如果问题超出中医范畴，请礼貌地说明。`

    try {
      const response = await aiClient.post('/chat/completions', {
        model: API_CONFIG.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 1000,
        temperature: 0.3,
        stream: false
      })

      return response.data.choices[0]?.message?.content || '抱歉，我无法回答这个问题。'
    } catch (error) {
      console.error('知识问答失败:', error)
      throw error
    }
  }

  /**
   * 解析诊断结果
   */
  private static parseDiagnosisResult(text: string): DiagnosisResponse {
    // 这里可以根据AI返回的格式进行更精细的解析
    // 目前采用简单的文本解析方式
    const sections = text.split('\n\n')
    
    return {
      diagnosis: text,
      summary: sections[0] || '中医诊断结果',
      syndromeType: this.extractSyndromeType(text),
      treatmentPrinciple: this.extractTreatmentPrinciple(text),
      recommendations: this.extractRecommendations(text),
      confidence: 0.8, // 可以根据AI的确定性调整
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 解析处方结果
   */
  private static parsePrescriptionResult(text: string): PrescriptionResponse {
    return {
      prescription: text,
      summary: '中药处方推荐',
      mainHerbs: this.extractHerbs(text),
      dosage: this.extractDosage(text),
      preparation: this.extractPreparation(text),
      precautions: this.extractPrecautions(text),
      duration: this.extractDuration(text),
      timestamp: new Date().toISOString()
    }
  }

  // 辅助解析方法
  private static extractSyndromeType(text: string): string {
    const match = text.match(/证型[:：]\s*([^\n]+)/)
    return match && match[1] !== undefined ? match[1].trim() : '需进一步辨证'
  }

  private static extractTreatmentPrinciple(text: string): string {
    const match = text.match(/治则[:：]\s*([^\n]+)/)
    return match && match[1] !== undefined ? match[1].trim() : '辨证施治'
  }

  private static extractRecommendations(text: string): string[] {
    const recommendations: string[] = []
    const lines = text.split('\n')
    let inRecommendations = false
    
    for (const line of lines) {
      if (line.includes('建议') || line.includes('调护')) {
        inRecommendations = true
      }
      if (inRecommendations && line.trim().startsWith('•')) {
        recommendations.push(line.trim().substring(1).trim())
      }
    }
    
    return recommendations.length > 0 ? recommendations : ['注意休息', '饮食调护', '情志调节']
  }

  private static extractHerbs(text: string): string[] {
    const herbs: string[] = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      // 简单的药材提取逻辑，可以根据需要优化
      const matches = line.match(/(\w+[\w\s]*?)[\s]*(\d+[g克])/g)
      if (matches) {
        herbs.push(...matches)
      }
    }
    
    return herbs.length > 0 ? herbs : ['需根据具体情况配伍']
  }

  private static extractDosage(text: string): string {
    const match = text.match(/剂量[:：]\s*([^\n]+)/)
    return match && match[1] ? match[1].trim() : '遵医嘱'
  }

  private static extractPreparation(text: string): string {
    const match = text.match(/煎服法[:：]\s*([^\n]+)/)
    return match && match[1] ? match[1].trim() : '水煎服'
  }

  private static extractPrecautions(text: string): string[] {
    const precautions: string[] = []
    const lines = text.split('\n')
    let inPrecautions = false
    
    for (const line of lines) {
      if (line.includes('注意') || line.includes('禁忌')) {
        inPrecautions = true
      }
      if (inPrecautions && line.trim().startsWith('•')) {
        precautions.push(line.trim().substring(1).trim())
      }
    }
    
    return precautions.length > 0 ? precautions : ['遵医嘱服用', '注意饮食禁忌']
  }

  private static extractDuration(text: string): string {
    const match = text.match(/疗程[:：]\s*([^\n]+)/)
    return match && match[1] ? match[1].trim() : '7-14天'
  }
}

export default TCMService