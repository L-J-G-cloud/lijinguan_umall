// 是否必填
export function validateNecessary(tipInfo, trigger = 'blur', isNeces = true,) {
    return {
        required: isNeces,
        message: tipInfo,
        trigger
    }
}

 // 验证最大长度
 export function validateLen(len = 20) {
   return {
     max: len,
     message: '最大长度为' + len + '个字符',
     trigger: 'blur'
   }
 }