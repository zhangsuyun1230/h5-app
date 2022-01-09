const alarmTypeMap = {
  1: '布控',
  2: '温度',
  3: '驻波',
  4: '断电',
  5: '流量异常',
  6: '功放',
  7: '湿度',
  8: '扫网',
  9: 'GPS',
  10: '断开',
  11: '功放温度',
  12: '更新',
  13: '数据上限',
  14: '特定时间',
  20: '其他',
  21: '板卡复位',
  22: '设备断开',
  23: '采集板硬件复位',
  30: '参数变更',
  40: '第三方布控',
  50: '预警阈值告警', 
  60: '特定目标预警',
  61: '进出区域预警',
  62: '多人碰头预警',
  63: '路线监控预警',
  64: '人群聚集预警',
  65: '换卡频繁预警'
}

const alarmTypeList = [
  {label: '全部', type: 0},
  {label: '特定目标预警', type: 60},
  {label: '进出区域预警', type: 61},
  {label: '多人碰头预警', type: 62},
  {label: '路线监控预警', type: 63},
  {label: '人群聚集预警', type: 64},
  {label: '换卡频繁预警', type: 65},
]

const alarmStateMap = {
  0: '未读',
  1: '已读',
  2: '过期'
}

const sexMap = {
  1: '男',
  2: '女'
}

export {
  alarmTypeMap,
  alarmStateMap,
  sexMap,
  alarmTypeList,
}