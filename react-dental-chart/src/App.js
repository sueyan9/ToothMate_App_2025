import WholeMouth from './components/WholeMouth'
import React from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import { LowerLeftCentralIncisor } from './components/Teeth/LowerLeftCentralIncisor'
import { LowerLeftFirstMolar } from './components/Teeth/LowerLeftFirstMolar'
import { LowerLeftWisdomTooth } from './components/Teeth/LowerLeftWisdomTooth'
import { LowerLeftSecondMolar } from './components/Teeth/LowerLeftSecondMolar'
import { LowerLeftFirstPremolar } from './components/Teeth/LowerLeftFirstPremolar'
import { LowerLeftSecondPremolar } from './components/Teeth/LowerLeftSecondPremolar'
import { LowerLeftCanine } from './components/Teeth/LowerLeftCanine'
import { LowerLeftLateralIncisor } from './components/Teeth/LowerLeftLateralIncisor'
import { LowerRightCentralIncisor } from './components/Teeth/LowerRightCentralIncisor'
import { LowerRightFirstMolar } from './components/Teeth/LowerRightFirstMolar'
import { LowerRightWisdomTooth } from './components/Teeth/LowerRightWisdomTooth'
import { LowerRightSecondMolar } from './components/Teeth/LowerRightSecondMolar'
import { LowerRightFirstPremolar } from './components/Teeth/LowerRightFirstPremolar'
import { LowerRightSecondPremolar } from './components/Teeth/LowerRightSecondPremolar'
import { LowerRightCanine } from './components/Teeth/LowerRightCanine'
import { LowerRightLateralIncisor } from './components/Teeth/LowerRightLateralIncisor'
import { UpperRightFirstPremolar } from './components/Teeth/UpperRightFirstPremolar'
import { UpperLeftWisdomTooth } from './components/Teeth/UpperLeftWisdomTooth'
import { UpperRightSecondPremolar } from './components/Teeth/UpperRightSecondPremolar'
import { UpperLeftLateralIncisor } from './components/Teeth/UpperLeftLateralIncisor'
import { UpperRightFirstMolar } from './components/Teeth/UpperRightFirstMolar'
import { UpperRightSecondMolar } from './components/Teeth/UpperRightSecondMolar'
import { UpperRightCanine } from './components/Teeth/UpperRightCanine'
import { UpperLeftCentralIncisor } from './components/Teeth/UpperLeftCentralIncisor'
import { UpperRightCentralIncisor } from './components/Teeth/UpperRightCentralIncisor'
import { UpperRightWisdomTooth } from './components/Teeth/UpperRightWisdomTooth'
import { UpperRightLateralIncisor } from './components/Teeth/UpperRightLateralIncisor'
import { UpperLeftFirstPremolar } from './components/Teeth/UpperLeftFirstPremolar'
import { UpperLeftSecondPremolar } from './components/Teeth/UpperLeftSecondPremolar'
import { UpperLeftCanine } from './components/Teeth/UpperLeftCanine'
import { UpperLeftFirstMolar } from './components/Teeth/UpperLeftFirstMolar'
import { UpperLeftSecondMolar } from './components/Teeth/UpperLeftSecondMolar'

export default function App() {
  return (
    <div>
      <Router>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<WholeMouth />} />

            {/* LOWER LEFT */}

            <Route path="/lower-left-wisdom" element={<LowerLeftWisdomTooth />} />
            <Route path="/lower-left-second-molar" element={<LowerLeftSecondMolar />} />
            <Route path="/lower-left-first-molar" element={<LowerLeftFirstMolar />} />
            <Route path="/lower-left-second-premolar" element={<LowerLeftSecondPremolar />} />
            <Route path="/lower-left-first-premolar" element={<LowerLeftFirstPremolar />} />
            <Route path="/lower-left-canine" element={<LowerLeftCanine />} />
            <Route path="/lower-left-lateral-incisor" element={<LowerLeftLateralIncisor />} />
            <Route path="/lower-left-central-incisor" element={<LowerLeftCentralIncisor />} />

            {/* LOWER RIGHT */}

            <Route path="/lower-right-wisdom" element={<LowerRightWisdomTooth />} />
            <Route path="/lower-right-second-molar" element={<LowerRightSecondMolar />} />
            <Route path="/lower-right-first-molar" element={<LowerRightFirstMolar />} />
            <Route path="/lower-right-second-premolar" element={<LowerRightSecondPremolar />} />
            <Route path="/lower-right-first-premolar" element={<LowerRightFirstPremolar />} />
            <Route path="/lower-right-canine" element={<LowerRightCanine />} />
            <Route path="/lower-right-lateral-incisor" element={<LowerRightLateralIncisor />} />
            <Route path="/lower-right-central-incisor" element={<LowerRightCentralIncisor />} />

            {/* UPPER LEFT */}

            <Route path="/upper-left-wisdom" element={<UpperLeftWisdomTooth />} />
            <Route path="/upper-left-second-molar" element={<UpperLeftSecondMolar />} />
            <Route path="/upper-left-first-molar" element={<UpperLeftFirstMolar />} />
            <Route path="/upper-left-second-premolar" element={<UpperLeftSecondPremolar />} />
            <Route path="/upper-left-first-premolar" element={<UpperLeftFirstPremolar />} />
            <Route path="/upper-left-canine" element={<UpperLeftCanine />} />
            <Route path="/upper-left-lateral-incisor" element={<UpperLeftLateralIncisor />} />
            <Route path="/upper-left-central-incisor" element={<UpperLeftCentralIncisor />} />

            {/* UPPER RIGHT */}

            <Route path="/upper-right-wisdom" element={<UpperRightWisdomTooth />} />
            <Route path="/upper-right-second-molar" element={<UpperRightSecondMolar />} />
            <Route path="/upper-right-first-molar" element={<UpperRightFirstMolar />} />
            <Route path="/upper-right-second-premolar" element={<UpperRightSecondPremolar />} />
            <Route path="/upper-right-first-premolar" element={<UpperRightFirstPremolar />} />
            <Route path="/upper-right-canine" element={<UpperRightCanine />} />
            <Route path="/upper-right-lateral-incisor" element={<UpperRightLateralIncisor />} />
            <Route path="/upper-right-central-incisor" element={<UpperRightCentralIncisor />} />
          </Routes>
          <div
            style={{
              marginBottom: 105 /* temp fix until I figure out a way to accurately represent 100vh on mobile */,
            }}
          ></div>
        </div>
      </Router>
    </div>
  )
}
