import { useEffect, useState } from "react";

export default function ToothInformation({ tooth }) {
const [isOpen, setIsOpen] = useState(false);
const onToggle = () => setIsOpen(!isOpen);

useEffect(() => {
    const handleClickOutside = () => {
      if (isOpen) setIsOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen]);

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };
  
  return (
    <div className={`tooth-info ${isOpen ? 'active' : ''}`} onClick={onToggle}>
      <div onClick={(e) => {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }} className="tooth-info-header">
        {isOpen ? '↓ More Information' : '↑ More Information'}
      </div>

      {isOpen && (
        <div onClick={handlePanelClick}>
          <div className="tooth-info-content">
          <h3>{tooth}</h3>
          <p>InformationBNKJFTNGLDTRNRFLSBGRKJLFSNDKLDREASNBDRJKSUBKERJTVHLOTLCRWIUSG CS</p>
          <p>UGTRJFNIHNERWORSBSGKTJCFINDWM RTH ,CHCTIOUHWOC WEOI9CHWOOE IVHOOTVHETY</p>
          <p>YSEBNLQWKERTDFBKJEWN3TRHIGFUEBKJ9958TUGEIJONFKEMSKOE2IQWLNELTHY</p>
          <p>RBGSKJ,EFITC4RFMIWR  WEI7RYFHGK GOJFEKMSFKLQ ICWHEFSOKJ ERDFLGNBLKSE</p>
          <p>InformationBNKJFTNGLDTRNRFLSBGRKJLFSNDKLDREASNBDRJKSUBKERJTVHLOTLCRWIUSG CS</p>
          <p>UGTRJFNIHNERWORSBSGKTJCFINDWM RTH ,CHCTIOUHWOC WEOI9CHWOOE IVHOOTVHETY</p>
          <p>YSEBNLQWKERTDFBKJEWN3TRHIGFUEBKJ9958TUGEIJONFKEMSKOE2IQWLNELTHY</p>
          <p>RBGSKJ,EFITC4RFMIWR  WEI7RYFHGK GOJFEKMSFKLQ ICWHEFSOKJ ERDFLGNBLKSE</p>
          <p>InformationBNKJFTNGLDTRNRFLSBGRKJLFSNDKLDREASNBDRJKSUBKERJTVHLOTLCRWIUSG CS</p>
          <p>UGTRJFNIHNERWORSBSGKTJCFINDWM RTH ,CHCTIOUHWOC WEOI9CHWOOE IVHOOTVHETY</p>
          <p>YSEBNLQWKERTDFBKJEWN3TRHIGFUEBKJ9958TUGEIJONFKEMSKOE2IQWLNELTHY</p>
          <p>RBGSKJ,EFITC4RFMIWR  WEI7RYFHGK GOJFEKMSFKLQ ICWHEFSOKJ ERDFLGNBLKSE</p>
          <p>InformationBNKJFTNGLDTRNRFLSBGRKJLFSNDKLDREASNBDRJKSUBKERJTVHLOTLCRWIUSG CS</p>
          <p>UGTRJFNIHNERWORSBSGKTJCFINDWM RTH ,CHCTIOUHWOC WEOI9CHWOOE IVHOOTVHETY</p>
          <p>YSEBNLQWKERTDFBKJEWN3TRHIGFUEBKJ9958TUGEIJONFKEMSKOE2IQWLNELTHY</p>
          <p>RBGSKJ,EFITC4RFMIWR  WEI7RYFHGK GOJFEKMSFKLQ ICWHEFSOKJ ERDFLGNBLKSE</p>
          <p>InformationBNKJFTNGLDTRNRFLSBGRKJLFSNDKLDREASNBDRJKSUBKERJTVHLOTLCRWIUSG CS</p>
          <p>UGTRJFNIHNERWORSBSGKTJCFINDWM RTH ,CHCTIOUHWOC WEOI9CHWOOE IVHOOTVHETY</p>
          <p>YSEBNLQWKERTDFBKJEWN3TRHIGFUEBKJ9958TUGEIJONFKEMSKOE2IQWLNELTHY</p>
          <p>RBGSKJ,EFITC4RFMIWR  WEI7RYFHGK GOJFEKMSFKLQ ICWHEFSOKJ ERDFLGNBLKSE</p>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          </div>
        </div>
      )}
    </div>
  );
}