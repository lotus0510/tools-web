import { useState } from 'react'
import './IdentityGenerator.css'

// 身份信息接口
interface Identity {
  name: string
  gender: string
  age: number
  birthday: string
  email: string
  phone: string
  address: {
    state: string      // 州/縣市
    district: string   // 區
    detail: string     // 詳細地址
    full: string       // 完整地址
  }
  occupation: string
  company: string
  idNumber: string
  bloodType: string
  height: number
  weight: number
  nationality: string
}

// 數據庫
const taiwanData = {
  firstNames: {
    male: ['志明', '建華', '偉強', '家豪', '志偉', '俊傑', '志華', '嘉豪', '國華', '文華', '明華', '志豪', '家明', '偉明', '俊華', '宗翰', '承恩', '宇軒', '冠宇', '柏翰'],
    female: ['美玲', '淑芬', '麗華', '雅婷', '怡君', '佳穎', '淑娟', '美惠', '雅芳', '淑貞', '麗娟', '美珍', '淑華', '雅慧', '佳玲', '詩涵', '語彤', '心妤', '芷若', '思妤']
  },
  lastNames: ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊', '許', '鄭', '謝', '洪', '郭', '邱', '曾', '廖', '賴', '徐', '周', '葉', '蘇', '莊', '呂'],
  occupations: [
    '軟體工程師', '產品經理', 'UI/UX設計師', '數位行銷專員', '業務代表', '會計師', '律師', '醫師', '護理師', '教師',
    '記者', '攝影師', '廚師', '服務員', '司機', '保全', '清潔員', '建築師', '土木工程師', '研究員', '藥師', '物理治療師'
  ],
  companies: [
    '台積電', '鴻海科技集團', '聯發科技', '廣達電腦', '華碩電腦', '宏碁', '台達電子', '中華電信', '遠傳電信', '台灣大哥大',
    '統一企業', '台塑集團', '長榮集團', '富邦金控', '國泰金控', '中信金控', '玉山銀行', '第一銀行', '華南銀行', '合作金庫',
    '台新銀行', '永豐銀行', '聯邦銀行', '元大金控', '新光金控'
  ],
  cities: ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市', '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣', '台東縣', '澎湖縣'],
  districts: ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區', '中西區', '東區', '南區', '北區', '安平區', '安南區'],
  roads: ['中山路', '中正路', '民生路', '民權路', '復興路', '和平路', '信義路', '仁愛路', '忠孝路', '建國路', '光復路', '敦化路', '南京路', '長安路', '松江路'],
  phonePrefix: ['09', '08', '07'],
  countryCode: '+886'
}

const usaData = {
  firstNames: {
    male: ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua'],
    female: ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']
  },
  lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'],
  occupations: [
    'Software Engineer', 'Product Manager', 'UX Designer', 'Marketing Specialist', 'Sales Representative', 'Accountant', 'Lawyer', 'Doctor', 'Nurse', 'Teacher',
    'Journalist', 'Photographer', 'Chef', 'Server', 'Driver', 'Security Guard', 'Cleaner', 'Architect', 'Engineer', 'Researcher', 'Pharmacist', 'Physical Therapist'
  ],
  companies: [
    'Apple Inc.', 'Microsoft Corporation', 'Amazon.com Inc.', 'Alphabet Inc.', 'Meta Platforms Inc.', 'Tesla Inc.', 'Berkshire Hathaway', 'NVIDIA Corporation', 'JPMorgan Chase & Co.', 'Johnson & Johnson',
    'Walmart Inc.', 'Procter & Gamble', 'Visa Inc.', 'Home Depot', 'Mastercard Inc.', 'Bank of America Corp.', 'Disney', 'Netflix Inc.', 'Adobe Inc.', 'Salesforce Inc.'
  ],
  states: ['California', 'Texas', 'Florida', 'New York', 'Pennsylvania', 'Illinois', 'Ohio', 'Georgia', 'North Carolina', 'Michigan', 'New Jersey', 'Virginia', 'Washington', 'Arizona', 'Massachusetts'],
  cities: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'],
  streets: ['Main St', 'Oak St', 'Pine St', 'Maple St', 'Cedar St', 'Elm St', 'Washington St', 'Lake St', 'Hill St', 'Park Ave', 'Lincoln St', 'First St', 'Second St', 'Third St', 'Fourth St'],
  phoneAreaCodes: ['212', '213', '312', '415', '617', '713', '818', '202', '305', '404', '602', '702', '206', '503', '214'],
  countryCode: '+1'
}

const bloodTypes = ['A', 'B', 'AB', 'O']

const IdentityGenerator = () => {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedGender, setSelectedGender] = useState<'random' | 'male' | 'female'>('random')
  const [selectedNationality, setSelectedNationality] = useState<'taiwan' | 'usa'>('taiwan')
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 })

  // 隨機選擇函數
  const randomChoice = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)]
  }

  // 隨機數字範圍
  const randomBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  // 生成隨機日期
  const generateBirthday = (age: number): string => {
    const currentYear = new Date().getFullYear()
    const birthYear = currentYear - age
    const month = randomBetween(1, 12)
    const day = randomBetween(1, 28) // 簡化處理，避免月份天數問題
    return `${birthYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  }

  // 生成身份證號碼（模擬格式）
  const generateIdNumber = (gender: string, nationality: string): string => {
    if (nationality === 'taiwan') {
      const firstDigit = gender === 'male' ? '1' : '2'
      const randomDigits = Array.from({ length: 8 }, () => randomBetween(0, 9)).join('')
      return `A${firstDigit}${randomDigits}`
    } else {
      // 美國 SSN 格式 (XXX-XX-XXXX)
      const area = randomBetween(100, 999)
      const group = randomBetween(10, 99)
      const serial = randomBetween(1000, 9999)
      return `${area}-${group}-${serial}`
    }
  }

  // 生成電話號碼
  const generatePhone = (nationality: string): string => {
    if (nationality === 'taiwan') {
      const prefix = randomChoice(taiwanData.phonePrefix)
      const numbers = Array.from({ length: 8 }, () => randomBetween(0, 9)).join('')
      return `${taiwanData.countryCode} ${prefix}${numbers}`
    } else {
      const areaCode = randomChoice(usaData.phoneAreaCodes)
      const exchange = randomBetween(200, 999)
      const number = randomBetween(1000, 9999)
      return `${usaData.countryCode} (${areaCode}) ${exchange}-${number}`
    }
  }

  // 生成電子郵件
  const generateEmail = (name: string, nationality: string): string => {
    const domains = nationality === 'taiwan' 
      ? ['gmail.com', 'yahoo.com.tw', 'hotmail.com', 'outlook.com', 'example.com.tw']
      : ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com']
    
    const randomNum = randomBetween(100, 999)
    let username: string
    
    if (nationality === 'taiwan') {
      // 台灣用戶名使用拼音或英文
      const englishName = name.replace(/[\u4e00-\u9fa5]/g, '') // 移除中文字符
      username = `user${randomNum}`
    } else {
      // 美國用戶名使用名字
      username = name.toLowerCase().replace(/\s+/g, '.') + randomNum
    }
    
    return `${username}@${randomChoice(domains)}`
  }

  // 生成地址
  const generateAddress = (nationality: string) => {
    if (nationality === 'taiwan') {
      const city = randomChoice(taiwanData.cities)
      const district = randomChoice(taiwanData.districts)
      const road = randomChoice(taiwanData.roads)
      const number = randomBetween(1, 999)
      const floor = randomBetween(1, 12)
      const detail = `${road}${number}號${floor}樓`
      const full = `${city}${district}${detail}`
      
      return {
        state: city,
        district: district,
        detail: detail,
        full: full
      }
    } else {
      const number = randomBetween(100, 9999)
      const street = randomChoice(usaData.streets)
      const city = randomChoice(usaData.cities)
      const state = randomChoice(usaData.states)
      const zipCode = randomBetween(10000, 99999)
      const detail = `${number} ${street}`
      const full = `${detail}, ${city}, ${state} ${zipCode}`
      
      return {
        state: state,
        district: city,
        detail: detail,
        full: full
      }
    }
  }

  // 生成完整身份
  const generateIdentity = (): Identity => {
    const gender = selectedGender === 'random' ? randomChoice(['male', 'female']) : selectedGender
    const nationality = selectedNationality
    const data = nationality === 'taiwan' ? taiwanData : usaData
    
    // 性別文字
    const genderText = nationality === 'taiwan' 
      ? (gender === 'male' ? '男' : '女')
      : (gender === 'male' ? 'Male' : 'Female')
    
    // 姓名
    const firstName = randomChoice(data.firstNames[gender])
    const lastName = randomChoice(data.lastNames)
    const name = nationality === 'taiwan' ? lastName + firstName : `${firstName} ${lastName}`
    
    const age = randomBetween(ageRange.min, ageRange.max)
    const birthday = generateBirthday(age)
    const email = generateEmail(name, nationality)
    const phone = generatePhone(nationality)
    const address = generateAddress(nationality)
    const occupation = randomChoice(data.occupations)
    const company = randomChoice(data.companies)
    const idNumber = generateIdNumber(gender, nationality)
    const bloodType = randomChoice(bloodTypes)
    
    // 身高體重根據國籍調整
    const height = nationality === 'taiwan'
      ? (gender === 'male' ? randomBetween(160, 185) : randomBetween(150, 175))
      : (gender === 'male' ? randomBetween(170, 195) : randomBetween(160, 180))
    
    const weight = nationality === 'taiwan'
      ? (gender === 'male' ? randomBetween(55, 90) : randomBetween(45, 75))
      : (gender === 'male' ? randomBetween(65, 110) : randomBetween(50, 85))

    return {
      name,
      gender: genderText,
      age,
      birthday,
      email,
      phone,
      address,
      occupation,
      company,
      idNumber,
      bloodType,
      height,
      weight,
      nationality: nationality === 'taiwan' ? '台灣' : '美國'
    }
  }

  // 處理生成按鈕點擊
  const handleGenerate = async () => {
    setIsGenerating(true)
    
    // 添加一些延遲效果，讓用戶感覺到生成過程
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newIdentity = generateIdentity()
    setIdentity(newIdentity)
    setIsGenerating(false)
  }

  // 複製到剪貼板
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 可以添加成功提示
    } catch (err) {
      console.error('複製失敗:', err)
    }
  }

  // 複製全部信息
  const copyAllInfo = async () => {
    if (!identity) return
    
    const isEnglish = identity.nationality === '美國'
    const allInfo = isEnglish ? `
Name: ${identity.name}
Gender: ${identity.gender}
Age: ${identity.age} years old
Birthday: ${identity.birthday}
Email: ${identity.email}
Phone: ${identity.phone}
Address: ${identity.address.full}
State: ${identity.address.state}
District/City: ${identity.address.district}
Detail: ${identity.address.detail}
Occupation: ${identity.occupation}
Company: ${identity.company}
ID Number: ${identity.idNumber}
Blood Type: ${identity.bloodType}
Height: ${identity.height}cm
Weight: ${identity.weight}kg
Nationality: ${identity.nationality}
    `.trim() : `
姓名: ${identity.name}
性別: ${identity.gender}
年齡: ${identity.age}歲
生日: ${identity.birthday}
電子郵件: ${identity.email}
電話: ${identity.phone}
完整地址: ${identity.address.full}
縣市: ${identity.address.state}
區域: ${identity.address.district}
詳細地址: ${identity.address.detail}
職業: ${identity.occupation}
公司: ${identity.company}
身份證號: ${identity.idNumber}
血型: ${identity.bloodType}型
身高: ${identity.height}cm
體重: ${identity.weight}kg
國籍: ${identity.nationality}
    `.trim()
    
    await copyToClipboard(allInfo)
  }

  return (
    <div className="identity-generator">
      <div className="tool-header">
        <h2>🎭 隨機身份生成器</h2>
        <p>生成虛假的個人身份信息，用於測試、演示或保護隱私</p>
      </div>

      <div className="generator-controls">
        <div className="control-group">
          <label>國籍選擇：</label>
          <div className="nationality-selector">
            <button 
              className={`control-btn ${selectedNationality === 'taiwan' ? 'active' : ''}`}
              onClick={() => setSelectedNationality('taiwan')}
            >
              🇹🇼 台灣
            </button>
            <button 
              className={`control-btn ${selectedNationality === 'usa' ? 'active' : ''}`}
              onClick={() => setSelectedNationality('usa')}
            >
              🇺🇸 美國
            </button>
          </div>
        </div>

        <div className="control-group">
          <label>性別選擇：</label>
          <div className="gender-selector">
            <button 
              className={`control-btn ${selectedGender === 'random' ? 'active' : ''}`}
              onClick={() => setSelectedGender('random')}
            >
              隨機
            </button>
            <button 
              className={`control-btn ${selectedGender === 'male' ? 'active' : ''}`}
              onClick={() => setSelectedGender('male')}
            >
              {selectedNationality === 'taiwan' ? '男性' : 'Male'}
            </button>
            <button 
              className={`control-btn ${selectedGender === 'female' ? 'active' : ''}`}
              onClick={() => setSelectedGender('female')}
            >
              {selectedNationality === 'taiwan' ? '女性' : 'Female'}
            </button>
          </div>
        </div>

        <div className="control-group age-control">
          <label>年齡範圍：</label>
          <div className="age-range">
            <div className="age-input-group">
              <label className="age-label">最小</label>
              <input
                type="number"
                min="1"
                max="100"
                value={ageRange.min}
                onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                className="age-input"
              />
            </div>
            <span className="age-separator">至</span>
            <div className="age-input-group">
              <label className="age-label">最大</label>
              <input
                type="number"
                min="1"
                max="100"
                value={ageRange.max}
                onChange={(e) => setAgeRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="age-input"
              />
            </div>
            <span className="age-unit">歲</span>
          </div>
        </div>

        <button 
          className="generate-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? '生成中...' : '🎲 生成隨機身份'}
        </button>
      </div>

      {identity && (
        <div className="identity-result">
          <div className="result-header">
            <h3>生成的身份信息</h3>
            <button className="copy-all-btn" onClick={copyAllInfo}>
              📋 複製全部
            </button>
          </div>

          <div className="identity-grid">
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Name' : '姓名'}</label>
              <div className="value-container">
                <span className="value">{identity.name}</span>
                <button onClick={() => copyToClipboard(identity.name)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Gender' : '性別'}</label>
              <div className="value-container">
                <span className="value">{identity.gender}</span>
                <button onClick={() => copyToClipboard(identity.gender)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Age' : '年齡'}</label>
              <div className="value-container">
                <span className="value">{identity.age}{identity.nationality === '美國' ? ' years old' : '歲'}</span>
                <button onClick={() => copyToClipboard(identity.age.toString())} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Birthday' : '生日'}</label>
              <div className="value-container">
                <span className="value">{identity.birthday}</span>
                <button onClick={() => copyToClipboard(identity.birthday)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Email' : '電子郵件'}</label>
              <div className="value-container">
                <span className="value">{identity.email}</span>
                <button onClick={() => copyToClipboard(identity.email)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Phone' : '電話'}</label>
              <div className="value-container">
                <span className="value">{identity.phone}</span>
                <button onClick={() => copyToClipboard(identity.phone)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'State' : '縣市'}</label>
              <div className="value-container">
                <span className="value">{identity.address.state}</span>
                <button onClick={() => copyToClipboard(identity.address.state)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'City/District' : '區域'}</label>
              <div className="value-container">
                <span className="value">{identity.address.district}</span>
                <button onClick={() => copyToClipboard(identity.address.district)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item full-width">
              <label>{identity.nationality === '美國' ? 'Street Address' : '詳細地址'}</label>
              <div className="value-container">
                <span className="value">{identity.address.detail}</span>
                <button onClick={() => copyToClipboard(identity.address.detail)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item full-width">
              <label>{identity.nationality === '美國' ? 'Full Address' : '完整地址'}</label>
              <div className="value-container">
                <span className="value">{identity.address.full}</span>
                <button onClick={() => copyToClipboard(identity.address.full)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Occupation' : '職業'}</label>
              <div className="value-container">
                <span className="value">{identity.occupation}</span>
                <button onClick={() => copyToClipboard(identity.occupation)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Company' : '公司'}</label>
              <div className="value-container">
                <span className="value">{identity.company}</span>
                <button onClick={() => copyToClipboard(identity.company)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'ID Number' : '身份證號'}</label>
              <div className="value-container">
                <span className="value">{identity.idNumber}</span>
                <button onClick={() => copyToClipboard(identity.idNumber)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Blood Type' : '血型'}</label>
              <div className="value-container">
                <span className="value">{identity.bloodType}{identity.nationality === '台灣' ? '型' : ''}</span>
                <button onClick={() => copyToClipboard(identity.bloodType)} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Height' : '身高'}</label>
              <div className="value-container">
                <span className="value">{identity.height}cm</span>
                <button onClick={() => copyToClipboard(identity.height.toString())} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Weight' : '體重'}</label>
              <div className="value-container">
                <span className="value">{identity.weight}kg</span>
                <button onClick={() => copyToClipboard(identity.weight.toString())} className="copy-btn">📋</button>
              </div>
            </div>

            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Nationality' : '國籍'}</label>
              <div className="value-container">
                <span className="value">{identity.nationality}</span>
                <button onClick={() => copyToClipboard(identity.nationality)} className="copy-btn">📋</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tool-info">
        <h4>⚠️ 重要提醒：</h4>
        <ul>
          <li><strong>僅供測試使用</strong>：生成的身份信息完全虛假，僅用於軟體測試、演示等合法用途</li>
          <li><strong>禁止非法使用</strong>：嚴禁用於詐騙、身份冒用或其他違法行為</li>
          <li><strong>保護隱私</strong>：可用於需要填寫個人信息但不想透露真實信息的場合</li>
          <li><strong>數據隨機</strong>：所有數據均為隨機生成，與真實人員無任何關聯</li>
          <li><strong>格式參考</strong>：身份證號等格式僅為示例，非真實有效證件</li>
        </ul>
      </div>
    </div>
  )
}

export default IdentityGenerator