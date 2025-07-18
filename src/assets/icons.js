import { SvgXml } from 'react-native-svg';

const icons = {
    home: `<svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M10.5 32V17H19.5V32M1.5 12.5L15 2L28.5 12.5V29C28.5 29.7956 28.1839 30.5587 27.6213 31.1213C27.0587 31.6839 26.2956 32 25.5 32H4.5C3.70435 32 2.94129 31.6839 2.37868 31.1213C1.81607 30.5587 1.5 29.7956 1.5 29V12.5Z" 
                   stroke="currentColor" 
                   stroke-width="2.5" 
                   stroke-linecap="round" 
                   stroke-linejoin="round"/>
           </svg>`,
    education: `<svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 28.25C2 27.2554 2.39509 26.3016 3.09835 25.5983C3.80161 24.8951 4.75544 24.5 5.75 24.5H26M2 28.25C2 29.2446 2.39509 30.1984 3.09835 30.9017C3.80161 31.6049 4.75544 32 5.75 32H26V2H5.75C4.75544 2 3.80161 2.39509 3.09835 3.09835C2.39509 3.80161 2 4.75544 2 5.75V28.25Z" 
                        stroke="currentColor" 
                        stroke-width="2.5" 
                        stroke-linecap="round" 
                        stroke-linejoin="round"/>
                </svg>`,
    calendar: `<svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M2.1875 10.1907V27.6477C2.1875 28.2 2.63522 28.6477 3.1875 28.6477H24.8125C25.3648 28.6477 25.8125 28.2 25.8125 27.6477V10.1907M2.1875 10.1907H25.8125M2.1875 10.1907V7.97583M25.8125 10.1907V7.97583M21.3828 5.76099H24.8125C25.3648 5.76099 25.8125 6.2087 25.8125 6.76099V7.97583M21.3828 5.76099V1.3313M21.3828 5.76099H6.61719M6.61719 5.76099H3.1875C2.63522 5.76099 2.1875 6.2087 2.1875 6.76099V7.97583M6.61719 5.76099V1.3313M2.1875 7.97583H25.8125" 
                       stroke="currentColor" 
                       stroke-width="2.5" 
                       stroke-linecap="round"/>
               </svg>`,
    profile: `<svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 28.5V25.5C26 23.9087 25.3679 22.3826 24.2426 21.2574C23.1174 20.1321 21.5913 19.5 20 19.5H8C6.4087 19.5 4.88258 20.1321 3.75736 21.2574C2.63214 22.3826 2 23.9087 2 25.5V28.5M20 7.5C20 10.8137 17.3137 13.5 14 13.5C10.6863 13.5 8 10.8137 8 7.5C8 4.18629 10.6863 1.5 14 1.5C17.3137 1.5 20 4.18629 20 7.5Z" 
                      stroke="currentColor" 
                      stroke-width="2.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
              </svg>`
};

export default function Icon({ name, color, size = 24 }) {
  return <SvgXml 
           xml={icons[name].replace(/currentColor/g, color)} 
           width={size} 
           height={size} 
         />;
}