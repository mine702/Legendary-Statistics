/** 현재 접속자가 PC로 접속했는지, 모바일로 접속했는지 구분합니다. */
export const getAgentType = ():"mobile"|"pc" => {
  const userAgent = navigator.userAgent;
  if (userAgent.match(/Android/i) || userAgent.match(/webOS/i) || 
    userAgent.match(/iPhone/i) || userAgent.match(/iPad/i) ||
    userAgent.match(/iPod/i) || userAgent.match(/BlackBerry/i) || 
    userAgent.match(/Windows Phone/i)) {
    return 'mobile';
  } else {
    return 'pc';
  }
}
/** 현재 접속자가 PC로 접속했는지, 모바일로 접속했는지 구분합니다. */
export const getAgentTypeByWidth = ():"mobile"|"pc" => {
  return window.innerWidth < 768 ? "mobile" : "pc";
}
