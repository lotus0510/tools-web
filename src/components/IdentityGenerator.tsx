import { useState } from 'react'
import './IdentityGenerator.css'

// 台灣城市資料
const taiwanCities = {
  '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '萬華區', '信義區', '士林區', '北投區', '內湖區', '南港區', '文山區'],
  '新北市': ['板橋區', '三重區', '中和區', '永和區', '新莊區', '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區', '汐止區', '瑞芳區'],
  '桃園市': ['桃園區', '中壢區', '大溪區', '楊梅區', '蘆竹區', '大園區', '龜山區', '八德區', '龍潭區', '平鎮區', '新屋區', '觀音區'],
  '台中市': ['中區', '東區', '南區', '西區', '北區', '北屯區', '西屯區', '南屯區', '太平區', '大里區', '霧峰區', '烏日區'],
  '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '楠西區'],
  '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區']
}

// 美國州份資料
const usaStates = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'Oakland', 'Fresno'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse', 'Albany', 'Yonkers'],
  'Texas': ['Houston', 'Dallas', 'Austin', 'San Antonio', 'Fort Worth', 'El Paso'],
  'Florida': ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Tallahassee', 'Fort Lauderdale'],
  'Illinois': ['Chicago', 'Aurora', 'Rockford', 'Joliet', 'Naperville', 'Springfield'],
  'Pennsylvania': ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie', 'Reading', 'Scranton']
}

// 血型
const bloodTypes = ['A', 'B', 'AB', 'O']

// 台灣姓氏
const taiwanSurnames = ['陳', '林', '黃', '張', '李', '王', '吳', '劉', '蔡', '楊', '許', '鄭', '謝', '郭', '洪', '邱', '曾', '廖', '賴', '徐', '周', '葉', '蘇', '莊', '呂', '江', '何', '蕭', '羅', '高', '潘', '簡', '朱', '鍾', '游', '彭', '詹', '胡', '施', '沈']

// 台灣名字
const taiwanMaleNames = ['志明', '家豪', '志偉', '俊傑', '建宏', '俊宏', '志豪', '志強', '建志', '俊男', '家銘', '志宏', '建華', '志華', '俊賢', '建成', '志成', '家維', '俊維', '建銘']
const taiwanFemaleNames = ['淑芬', '淑惠', '美玲', '雅雯', '怡君', '佳穎', '美惠', '淑娟', '雅婷', '怡萱', '佳蓉', '美華', '淑貞', '雅慧', '怡佳', '佳玲', '美玉', '淑華', '雅玲', '怡雯']

// 美國姓氏
const usaSurnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']

// 美國名字
const usaMaleNames = ['James', 'Robert', 'John', 'Michael', 'David', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua']
const usaFemaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Helen', 'Sandra', 'Donna', 'Carol', 'Ruth', 'Sharon', 'Michelle']

// 職業
const taiwanOccupations = ['軟體工程師', '護理師', '教師', '會計師', '業務員', '設計師', '醫師', '律師', '廚師', '司機', '店員', '工程師', '行政助理', '銀行員', '保險業務', '房仲', '美髮師', '按摩師', '清潔員', '保全']
const usaOccupations = ['Software Engineer', 'Nurse', 'Teacher', 'Accountant', 'Sales Representative', 'Designer', 'Doctor', 'Lawyer', 'Chef', 'Driver', 'Clerk', 'Engineer', 'Administrative Assistant', 'Banker', 'Insurance Agent', 'Real Estate Agent', 'Hairdresser', 'Massage Therapist', 'Cleaner', 'Security Guard']

// 公司名稱
const taiwanCompanies = ['台積電', '鴻海科技', '聯發科', '廣達電腦', '華碩', '宏碁', '中華電信', '台灣大哥大', '遠傳電信', '統一企業', '台塑集團', '長榮集團', '中鋼', '台電', '中油', '第一銀行', '玉山銀行', '國泰金控', '富邦金控', '新光集團']
const usaCompanies = ['Apple Inc.', 'Microsoft Corporation', 'Amazon.com Inc.', 'Google LLC', 'Meta Platforms Inc.', 'Tesla Inc.', 'Netflix Inc.', 'Adobe Inc.', 'Salesforce Inc.', 'Oracle Corporation', 'IBM Corporation', 'Intel Corporation', 'Cisco Systems', 'PayPal Holdings', 'Uber Technologies', 'Airbnb Inc.', 'Zoom Video Communications', 'Shopify Inc.', 'Square Inc.', 'Dropbox Inc.']

interface Identity {
  name: string
  gender: string
  age: number
  birthday: string
  email: string
  phone: string
  address: {
    state: string
    district: string
    detail: string
    full: string
  }
  occupation: string
  company: string
  idNumber: string
  bloodType: string
  height: number
  weight: number
  nationality: string
}

const IdentityGenerator = () => {
  const [identity, setIdentity] = useState<Identity | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedGender, setSelectedGender] = useState<'random' | 'male' | 'female'>('random')
  const [selectedNationality, setSelectedNationality] = useState<'taiwan' | 'usa'>('taiwan')
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 })
  const [batchCount, setBatchCount] = useState(1)
  const [batchIdentities, setBatchIdentities] = useState<Identity[]>([])
  const [showBatchMode, setShowBatchMode] = useState(false)

  // 隨機選擇函數
  const randomChoice = <T,>(array: T[]): T => array[Math.floor(Math.random() * array.length)]

  // 生成隨機生日
  const generateRandomBirthday = (age: number): string => {
    const today = new Date()
    const birthYear = today.getFullYear() - age
    const birthMonth = Math.floor(Math.random() * 12) + 1
    const daysInMonth = new Date(birthYear, birthMonth, 0).getDate()
    const birthDay = Math.floor(Math.random() * daysInMonth) + 1
    
    return `${birthYear}/${birthMonth.toString().padStart(2, '0')}/${birthDay.toString().padStart(2, '0')}`
  }

  // 生成台灣身份證號
  const generateTaiwanId = (gender: string): string => {
    const cityCode = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    const firstChar = randomChoice(cityCode)
    const genderCode = gender === '男' ? '1' : '2'
    const randomNumbers = Array.from({length: 7}, () => Math.floor(Math.random() * 10)).join('')
    
    // 簡化的檢查碼計算
    const checkDigit = Math.floor(Math.random() * 10)
    
    return `${firstChar}${genderCode}${randomNumbers}${checkDigit}`
  }

  // 生成美國SSN
  const generateUSASSN = (): string => {
    const area = Math.floor(Math.random() * 899) + 100
    const group = Math.floor(Math.random() * 99) + 1
    const serial = Math.floor(Math.random() * 9999) + 1
    
    return `${area.toString().padStart(3, '0')}-${group.toString().padStart(2, '0')}-${serial.toString().padStart(4, '0')}`
  }

  // 生成隨機身份
  const generateRandomIdentity = (): Identity => {
    const isTaiwan = selectedNationality === 'taiwan'
    const genderOptions = selectedGender === 'random' ? ['male', 'female'] : [selectedGender]
    const randomGender = randomChoice(genderOptions)
    const genderText = isTaiwan ? (randomGender === 'male' ? '男' : '女') : (randomGender === 'male' ? 'Male' : 'Female')
    
    const age = Math.floor(Math.random() * (ageRange.max - ageRange.min + 1)) + ageRange.min
    const birthday = generateRandomBirthday(age)
    
    let name: string
    let surname: string
    let firstName: string
    
    if (isTaiwan) {
      surname = randomChoice(taiwanSurnames)
      firstName = randomGender === 'male' ? randomChoice(taiwanMaleNames) : randomChoice(taiwanFemaleNames)
      name = surname + firstName
    } else {
      surname = randomChoice(usaSurnames)
      firstName = randomGender === 'male' ? randomChoice(usaMaleNames) : randomChoice(usaFemaleNames)
      name = `${firstName} ${surname}`
    }
    
    // 修復電子郵件生成 - 多樣化用戶名
    const emailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'protonmail.com', 'live.com']
    const randomDomain = randomChoice(emailDomains)
    
    // 擴充的英文名字庫
    const firstNames = ['alex', 'david', 'john', 'mike', 'tom', 'jack', 'sam', 'ben', 'chris', 'ryan',
                       'lisa', 'mary', 'anna', 'sara', 'emma', 'lucy', 'kate', 'amy', 'jane', 'rose',
                       'james', 'robert', 'william', 'richard', 'charles', 'joseph', 'thomas', 'daniel',
                       'matthew', 'anthony', 'mark', 'donald', 'steven', 'paul', 'andrew', 'joshua',
                       'patricia', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica',
                       'sarah', 'karen', 'nancy', 'betty', 'helen', 'sandra', 'donna', 'carol']
    
    const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis',
                      'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson',
                      'thomas', 'taylor', 'moore', 'jackson', 'martin', 'lee', 'perez', 'thompson',
                      'white', 'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson']
    
    // 多種郵件用戶名生成方式
    const emailGenerationMethods = [
      // 方法1: 名字 + 數字
      () => `${randomChoice(firstNames)}${Math.floor(Math.random() * 1000)}`,
      // 方法2: 姓.名 + 數字
      () => `${randomChoice(firstNames)}.${randomChoice(lastNames)}${Math.floor(Math.random() * 100)}`,
      // 方法3: 姓名組合 + 年份
      () => `${randomChoice(firstNames)}${randomChoice(lastNames)}${Math.floor(Math.random() * 30) + 1990}`,
      // 方法4: 名字 + 姓氏首字母 + 數字
      () => `${randomChoice(firstNames)}${randomChoice(lastNames).charAt(0)}${Math.floor(Math.random() * 999)}`,
      // 方法5: 隨機字母組合 + 數字
      () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz'
        let result = ''
        for (let i = 0; i < Math.floor(Math.random() * 3) + 4; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return result + Math.floor(Math.random() * 1000)
      },
      // 方法6: 真實姓名轉拼音 (簡化版)
      () => {
        if (isTaiwan) {
          const pinyinMap: Record<string, string> = {
            '陳': 'chen', '林': 'lin', '黃': 'huang', '張': 'zhang', '李': 'li', '王': 'wang',
            '吳': 'wu', '劉': 'liu', '蔡': 'cai', '楊': 'yang', '許': 'xu', '鄭': 'zheng',
            '志明': 'zhiming', '家豪': 'jiahao', '志偉': 'zhiwei', '淑芬': 'shufen', '淑惠': 'shuhui'
          }
          const surnamePin = pinyinMap[surname] || randomChoice(firstNames)
          const firstNamePin = pinyinMap[firstName] || randomChoice(lastNames)
          return `${surnamePin}${firstNamePin}${Math.floor(Math.random() * 100)}`
        } else {
          return `${firstName.toLowerCase()}${surname.toLowerCase()}${Math.floor(Math.random() * 100)}`
        }
      }
    ]
    
    const generateEmailUsername = randomChoice(emailGenerationMethods)
    const emailUsername = generateEmailUsername()
    const email = `${emailUsername}@${randomDomain}`
    
    const cities = isTaiwan ? taiwanCities : usaStates
    const cityKeys = Object.keys(cities)
    const selectedCity = randomChoice(cityKeys)
    const selectedDistrict = randomChoice(cities[selectedCity as keyof typeof cities])
    
    const streetNumber = Math.floor(Math.random() * 999) + 1
    const streetNames = isTaiwan 
      ? ['中正路', '中山路', '民生路', '民族路', '光復路', '建國路', '忠孝路', '仁愛路', '信義路', '和平路']
      : ['Main Street', 'Oak Avenue', 'Park Road', 'First Street', 'Second Avenue', 'Elm Street', 'Maple Drive', 'Cedar Lane', 'Pine Street', 'Washington Ave']
    const streetName = randomChoice(streetNames)
    
    const detail = isTaiwan ? `${streetName}${streetNumber}號` : `${streetNumber} ${streetName}`
    const fullAddress = isTaiwan 
      ? `${selectedCity}${selectedDistrict}${detail}`
      : `${streetNumber} ${streetName}, ${selectedDistrict}, ${selectedCity}`
    
    const occupation = isTaiwan ? randomChoice(taiwanOccupations) : randomChoice(usaOccupations)
    const company = isTaiwan ? randomChoice(taiwanCompanies) : randomChoice(usaCompanies)
    
    const phone = isTaiwan 
      ? `+886-9${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`
      : `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
    
    const idNumber = isTaiwan ? generateTaiwanId(genderText) : generateUSASSN()
    const bloodType = randomChoice(bloodTypes)
    const height = Math.floor(Math.random() * 50) + 150
    const weight = Math.floor(Math.random() * 50) + 50
    
    return {
      name,
      gender: genderText,
      age,
      birthday,
      email,
      phone,
      address: {
        state: selectedCity,
        district: selectedDistrict as string,
        detail,
        full: fullAddress
      },
      occupation,
      company,
      idNumber,
      bloodType,
      height,
      weight,
      nationality: isTaiwan ? '台灣' : '美國'
    }
  }

  // 複製到剪貼板
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      // 可以添加提示訊息
    })
  }

  // 複製所有資訊
  const copyAllInfo = () => {
    if (!identity) return
    
    const isEnglish = identity.nationality === '美國'
    const info = isEnglish ? [
      `Name: ${identity.name}`,
      `Gender: ${identity.gender}`,
      `Age: ${identity.age}`,
      `Birthday: ${identity.birthday}`,
      `Email: ${identity.email}`,
      `Phone: ${identity.phone}`,
      `Address: ${identity.address.full}`,
      `Occupation: ${identity.occupation}`,
      `Company: ${identity.company}`,
      `ID Number: ${identity.idNumber}`,
      `Blood Type: ${identity.bloodType}`,
      `Height: ${identity.height}cm`,
      `Weight: ${identity.weight}kg`,
      `Nationality: ${identity.nationality}`
    ] : [
      `姓名: ${identity.name}`,
      `性別: ${identity.gender}`,
      `年齡: ${identity.age}`,
      `生日: ${identity.birthday}`,
      `電子郵件: ${identity.email}`,
      `電話: ${identity.phone}`,
      `地址: ${identity.address.full}`,
      `職業: ${identity.occupation}`,
      `公司: ${identity.company}`,
      `身份證號: ${identity.idNumber}`,
      `血型: ${identity.bloodType}型`,
      `身高: ${identity.height}cm`,
      `體重: ${identity.weight}kg`,
      `國籍: ${identity.nationality}`
    ]
    
    copyToClipboard(info.join('\n'))
  }

  // CSV 下載功能（保留）
  const downloadCSV = () => {
    if (batchIdentities.length === 0) return;
    const isEnglish = batchIdentities[0].nationality === '美國';
    const headers = isEnglish ? [
      'Name', 'Gender', 'Age', 'Birthday', 'Email', 'Phone',
      'State', 'District', 'Street Address', 'Full Address',
      'Occupation', 'Company', 'ID Number', 'Blood Type',
      'Height (cm)', 'Weight (kg)', 'Nationality'
    ] : [
      '姓名', '性別', '年齡', '生日', '電子郵件', '電話',
      '縣市', '區域', '詳細地址', '完整地址',
      '職業', '公司', '身份證號', '血型',
      '身高(cm)', '體重(kg)', '國籍'
    ];
    const csvData = batchIdentities.map(identity => [
      identity.name,
      identity.gender,
      identity.age,
      identity.birthday,
      identity.email,
      identity.phone,
      identity.address.state,
      identity.address.district,
      identity.address.detail,
      identity.address.full,
      identity.occupation,
      identity.company,
      identity.idNumber,
      identity.bloodType + (isEnglish ? '' : '型'),
      identity.height,
      identity.weight,
      identity.nationality
    ]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row =>
        row.map(field =>
          typeof field === 'string' && (field.includes(',') || field.includes('"'))
            ? `"${field.replace(/"/g, '""')}"`
            : field
        ).join(',')
      )
    ].join('\n');
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const fileName = batchIdentities.length > 1
      ? `batch_identities_${batchIdentities.length}_${new Date().toISOString().split('T')[0]}.csv`
      : `identity_${identity?.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url)
  }

  // PDF 下載功能 - 使用瀏覽器打印功能避免中文亂碼
  const downloadPDF = () => {
    if (batchIdentities.length === 0) return

    const isEnglish = batchIdentities[0].nationality === '美國'
    
    // 創建一個新的窗口用於打印
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    // 生成 HTML 內容
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${isEnglish ? 'Generated Identity Information' : '生成的身份信息'}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
            color: #333;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 24px;
          }
          .identity-section {
            margin-bottom: 40px;
            page-break-inside: avoid;
          }
          .identity-title {
            background: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #007bff;
            margin-bottom: 20px;
            font-weight: bold;
            font-size: 18px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 20px;
          }
          .info-item {
            padding: 10px;
            border: 1px solid #e9ecef;
            border-radius: 4px;
            background: #f8f9fa;
          }
          .info-label {
            font-weight: bold;
            color: #495057;
            margin-bottom: 5px;
          }
          .info-value {
            color: #2c3e50;
            word-break: break-all;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #6c757d;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
          }
          @media print {
            body { margin: 0; }
            .identity-section { page-break-after: auto; }
          }
          @media screen {
            body { max-width: 800px; margin: 0 auto; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${isEnglish ? 'Generated Identity Information' : '生成的身份信息'}</h1>
          ${batchIdentities.length > 1 ? `<p>${isEnglish ? `Total: ${batchIdentities.length} identities` : `共 ${batchIdentities.length} 個身份`}</p>` : ''}
        </div>
        
        ${batchIdentities.map((identity, index) => `
          <div class="identity-section">
            ${batchIdentities.length > 1 ? `<div class="identity-title">${isEnglish ? `Identity ${index + 1}` : `身份 ${index + 1}`}</div>` : ''}
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Name' : '姓名'}</div>
                <div class="info-value">${identity.name}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Gender' : '性別'}</div>
                <div class="info-value">${identity.gender}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Age' : '年齡'}</div>
                <div class="info-value">${identity.age}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Birthday' : '生日'}</div>
                <div class="info-value">${identity.birthday}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Email' : '電子郵件'}</div>
                <div class="info-value">${identity.email}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Phone' : '電話'}</div>
                <div class="info-value">${identity.phone}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Address' : '地址'}</div>
                <div class="info-value">${identity.address.full}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Occupation' : '職業'}</div>
                <div class="info-value">${identity.occupation}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Company' : '公司'}</div>
                <div class="info-value">${identity.company}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'ID Number' : '身份證號'}</div>
                <div class="info-value">${identity.idNumber}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Blood Type' : '血型'}</div>
                <div class="info-value">${identity.bloodType}${identity.nationality === '美國' ? '' : '型'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Height' : '身高'}</div>
                <div class="info-value">${identity.height}cm</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Weight' : '體重'}</div>
                <div class="info-value">${identity.weight}kg</div>
              </div>
              <div class="info-item">
                <div class="info-label">${identity.nationality === '美國' ? 'Nationality' : '國籍'}</div>
                <div class="info-value">${identity.nationality}</div>
              </div>
            </div>
          </div>
        `).join('')}
        
        <div class="footer">
          <p>${isEnglish ? 'Generated on' : '生成時間'}: ${new Date().toLocaleString(isEnglish ? 'en-US' : 'zh-TW')}</p>
          <p style="font-size: 10px; color: #999;">
            ${isEnglish ? 'This information is generated for testing purposes only and should not be used for illegal activities.' : '此信息僅供測試使用，請勿用於非法用途。'}
          </p>
        </div>
      </body>
      </html>
    `

    // 寫入內容並觸發打印
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // 等待內容載入完成後觸發打印對話框
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        // 打印完成後關閉窗口
        printWindow.onafterprint = () => {
          printWindow.close()
        }
      }, 500)
    }
  }

  // 生成身份
  const handleGenerate = () => {
    setIsGenerating(true)
    
    setTimeout(() => {
      if (showBatchMode && batchCount > 1) {
        const identities = Array.from({ length: batchCount }, () => generateRandomIdentity())
        setBatchIdentities(identities)
        setIdentity(identities[0])
      } else {
        const newIdentity = generateRandomIdentity()
        setIdentity(newIdentity)
        setBatchIdentities([newIdentity])
      }
      setIsGenerating(false)
    }, 500)
  }

  return (
    <div className="identity-generator">
      <div className="tool-header">
        <h2>🎭 隨機身份生成器</h2>
        <p>生成虛假的個人身份信息，用於測試、演示或保護隱私</p>
      </div>

      <div className="generator-controls">
        <div className="control-group">
          <label>國籍：</label>
          <select 
            value={selectedNationality} 
            onChange={(e) => setSelectedNationality(e.target.value as 'taiwan' | 'usa')}
          >
            <option value="taiwan">台灣</option>
            <option value="usa">美國</option>
          </select>
        </div>

        <div className="control-group">
          <label>性別：</label>
          <select 
            value={selectedGender} 
            onChange={(e) => setSelectedGender(e.target.value as 'random' | 'male' | 'female')}
          >
            <option value="random">隨機</option>
            <option value="male">男性</option>
            <option value="female">女性</option>
          </select>
        </div>

        <div className="control-group">
          <label>年齡範圍：</label>
          <div className="age-range">
            <input
              type="number"
              min="1"
              max="100"
              value={ageRange.min}
              onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
            />
            <span>到</span>
            <input
              type="number"
              min="1"
              max="100"
              value={ageRange.max}
              onChange={(e) => setAgeRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
            />
          </div>
        </div>

        <div className="control-group">
          <label>
            <input
              type="checkbox"
              checked={showBatchMode}
              onChange={(e) => setShowBatchMode(e.target.checked)}
            />
            批量生成模式
          </label>
        </div>

        {showBatchMode && (
          <div className="control-group">
            <label>生成數量：</label>
            <input
              type="number"
              min="1"
              max="100"
              value={batchCount}
              onChange={(e) => setBatchCount(parseInt(e.target.value))}
            />
          </div>
        )}

        <button 
          className="generate-btn" 
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? '生成中...' : (showBatchMode ? `生成 ${batchCount} 個身份` : '生成隨機身份')}
        </button>
      </div>

      {identity && (
        <div className="identity-result">
          <div className="result-header">
            <h3>
              生成的身份信息
              {batchIdentities.length > 1 && (
                <span className="batch-indicator"> (共 {batchIdentities.length} 個)</span>
              )}
            </h3>
            <div className="result-actions">
              <button className="copy-all-btn" onClick={copyAllInfo}>
                📋 複製當前
              </button>
              <button
                className="download-csv-btn"
                onClick={downloadCSV}
                title={batchIdentities.length > 1 ? `下載 ${batchIdentities.length} 個身份的CSV文件` : '下載CSV文件'}
              >
                📊 下載CSV
              </button>
              <button
                className={`download-pdf-btn ${batchIdentities.length > 1 ? 'batch-download' : ''}`}
                onClick={downloadPDF}
                title={batchIdentities.length > 1 ? `下載 ${batchIdentities.length} 個身份的PDF文件` : '下載PDF文件'}
              >
                📄 下載PDF
              </button>
            </div>
          </div>

          {batchIdentities.length > 1 && (
            <div className="batch-navigation">
              <span className="nav-info">當前顯示：</span>
              {batchIdentities.map((_, index) => (
                <button
                  key={index}
                  className={`nav-btn ${identity === batchIdentities[index] ? 'active' : ''}`}
                  onClick={() => setIdentity(batchIdentities[index])}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}

          <div className="identity-grid">
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Name' : '姓名'}：</label>
              <span onClick={() => copyToClipboard(identity.name)}>{identity.name}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.name)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Gender' : '性別'}：</label>
              <span onClick={() => copyToClipboard(identity.gender)}>{identity.gender}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.gender)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Age' : '年齡'}：</label>
              <span onClick={() => copyToClipboard(identity.age.toString())}>{identity.age}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.age.toString())} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Birthday' : '生日'}：</label>
              <span onClick={() => copyToClipboard(identity.birthday)}>{identity.birthday}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.birthday)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Email' : '電子郵件'}：</label>
              <span onClick={() => copyToClipboard(identity.email)}>{identity.email}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.email)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Phone' : '電話'}：</label>
              <span onClick={() => copyToClipboard(identity.phone)}>{identity.phone}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.phone)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'State/City' : '縣市'}：</label>
              <span onClick={() => copyToClipboard(identity.address.state)}>{identity.address.state}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.address.state)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'District' : '區域'}：</label>
              <span onClick={() => copyToClipboard(identity.address.district)}>{identity.address.district}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.address.district)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Street Address' : '詳細地址'}：</label>
              <span onClick={() => copyToClipboard(identity.address.detail)}>{identity.address.detail}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.address.detail)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Full Address' : '完整地址'}：</label>
              <span onClick={() => copyToClipboard(identity.address.full)}>{identity.address.full}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.address.full)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Occupation' : '職業'}：</label>
              <span onClick={() => copyToClipboard(identity.occupation)}>{identity.occupation}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.occupation)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Company' : '公司'}：</label>
              <span onClick={() => copyToClipboard(identity.company)}>{identity.company}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.company)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'ID Number' : '身份證號'}：</label>
              <span onClick={() => copyToClipboard(identity.idNumber)}>{identity.idNumber}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.idNumber)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Blood Type' : '血型'}：</label>
              <span onClick={() => copyToClipboard(identity.bloodType + (identity.nationality === '美國' ? '' : '型'))}>
                {identity.bloodType}{identity.nationality === '美國' ? '' : '型'}
              </span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.bloodType + (identity.nationality === '美國' ? '' : '型'))} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Height' : '身高'}：</label>
              <span onClick={() => copyToClipboard(`${identity.height}cm`)}>{identity.height}cm</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(`${identity.height}cm`)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Weight' : '體重'}：</label>
              <span onClick={() => copyToClipboard(`${identity.weight}kg`)}>{identity.weight}kg</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(`${identity.weight}kg`)} title="複製">📋</button>
            </div>
            <div className="identity-item">
              <label>{identity.nationality === '美國' ? 'Nationality' : '國籍'}：</label>
              <span onClick={() => copyToClipboard(identity.nationality)}>{identity.nationality}</span>
              <button className="copy-item-btn" onClick={() => copyToClipboard(identity.nationality)} title="複製">📋</button>
            </div>
          </div>
        </div>
      )}

      <div className="tool-info">
        <h4>⚠️ 重要提醒</h4>
        <ul>
          <li>此工具生成的所有信息均為虛假數據，僅供測試和演示使用</li>
          <li>請勿將生成的身份信息用於任何非法用途</li>
          <li>生成的身份證號碼和SSN僅為格式正確的隨機數字，非真實有效證件</li>
          <li>點擊任何信息項目可快速複製到剪貼板</li>
          <li>支援CSV和PDF格式下載，方便保存和分享</li>
        </ul>
      </div>
    </div>
  )
}

export default IdentityGenerator
