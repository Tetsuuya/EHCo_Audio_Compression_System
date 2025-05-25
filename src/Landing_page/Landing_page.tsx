import { useNavigate } from 'react-router-dom'
import HugeIcon from '../assets/images/Huge Icon.png'
import Researchers from '../assets/images/Researchers.png'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="font-['Open_Sans']">
      <div 
        className="min-h-screen flex flex-col relative p-4"
        style={{
          background: 'linear-gradient(to bottom right, #010510 0%, #1B4CFF 100%)'
        }}
      >
        {/* Logo in the upper left */}
        <div 
          className="absolute z-10"
          style={{
            top: '-1% ',
            left: '0.5%',
          }}
        >
          <img 
            src="/Logo/Logo_White.png" 
            alt="EHCo Logo" 
            style={{ 
              width: '600px', 
              height: '350px',
              fontFamily: 'Open Sans, sans-serif',
              fontWeight: 400
            }} 
          />
        </div>

        {/* About Section */}
        <div className="max-w-2xl text-white z-10 absolute left-20 top-1/3">
          <h2 className="text-7xl font-bold mb-8">About</h2>
          <div style={{ width: '900px' }}>
            <p className="text-gray-200" style={{ 
              fontSize: '26px', 
              lineHeight: '1.35',
              textAlign: 'justify',
              wordSpacing: '-1.5px',
              letterSpacing: '0.2px'
            }}>
              This platform showcases a research initiative developed by
              second-year Computer Science students from the University
              of Science and Technology of Southern Philippines – Cagayan
              de Oro (USTP-CDO). This project explores an enhanced audio
              compression technique by integrating Adaptive Huffman
              Coding with Discrete Cosine Transform (DCT) and Run-Length
              Encoding (RLE).
            </p>
            <p className="text-gray-200 mt-7" style={{ 
              fontSize: '26px', 
              lineHeight: '1.35',
              textAlign: 'justify',
              wordSpacing: '-1.5px',
              letterSpacing: '0.2px'
            }}>
              By combining these methods, EHCo aims to achieve improved
              compression efficiency for audio signal processing. Experience
              the innovation firsthand — try EHCo and discover the potential
              of optimized audio compression.
            </p>
          </div>
        </div>

        {/* Main icon and button area */}
        <div className="absolute right-25 bottom-10">
          <div className="flex flex-col items-center">
            <img 
              src={HugeIcon} 
              alt="EHCo Audio Compression" 
              className="w-[750px] h-[750px]" 
            />
            <button
              onClick={() => navigate('/home')}
              className="mt-0 bg-white/10 backdrop-blur-sm text-white font-bold py-1.5 px-6 rounded-full hover:bg-white/20 transition-all duration-300 text-4xl min-w-[400px] border border-white/30 active:scale-95 active:bg-white/30 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Try EHCo Now!
            </button>
          </div>
        </div>
      </div>

      {/* New Footer Section */}
      <div className="h-[500px] bg-white w-full">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center">
            <img 
              src={Researchers} 
              alt="Researchers" 
              className="h-[500px] w-[2000px] object-contain"
            />
            <div className="flex items-center gap-5 mt-12 border-[4px] border-[#1B4CFF] rounded-2xl">
              <span className="text-[#1B4CFF] font-normal ml-6 text-xl">Read our paper:</span>
              <button
                className="bg-[#1B4CFF] text-white px-8 py-3 rounded-1xl text-lg hover:bg-[#1B4CFF]/80 transition-all font-bold"
              >
                Paper will be available once published »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
