import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VotingPage = () => {
  const [choice, setChoice] = useState('');
  const [voted, setVoted] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [amendmentDetails, setAmendmentDetails] = useState(null);
  const navigate = useNavigate();
  const { sessionToken, setSessionToken } = useAuth();

  const checkVoteStatus = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/vote/check', {
        headers: { Authorization: sessionToken }
      });
      setVoted(response.data.hasVoted);
      return response.data.hasVoted;
    } catch (error) {
      console.error('Vote status check error:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Verify authentication
        await axios.get('http://localhost:5000/api/v1/auth/check', {
          headers: { Authorization: sessionToken }
        });

        // Check vote status
        const hasVoted = await checkVoteStatus();
        
        // Only load amendment details if not voted yet
        if (!hasVoted) {
          const amendmentRes = await axios.get('http://localhost:5000/api/v1/vote/amendment');
          setAmendmentDetails(amendmentRes.data);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          navigate('/');
        }
        // No error message set intentionally
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionToken) {
      fetchData();
    } else {
      navigate('/');
    }
  }, [sessionToken, navigate]);

  const handleVote = async () => {
    if (!choice) return;
    
    try {
      // Optimistic UI update
      setVoted(true);
      setMessage({ 
        text: 'Your vote is being processed...', 
        type: 'info' 
      });

      await axios.post(
        'http://localhost:5000/api/v1/vote',
        { choice },
        { headers: { Authorization: sessionToken } }
      );
      
      setMessage({ 
        text: 'Thank you for voting! Your choice has been recorded.', 
        type: 'success' 
      });
    } catch (error) {
      // Revert optimistic update if failed
      setVoted(false);
      
      if (error.response?.status === 400 && error.response?.data?.message === 'Already voted') {
        setVoted(true);
        // No message shown for already voted case
      } else {
        setMessage({ 
          text: 'Voting is currently unavailable. Please try again later.', 
          type: 'warning' 
        });
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/v1/auth/logout', {}, {
        headers: { Authorization: sessionToken }
      });
      setSessionToken(null);
      navigate('/');
    } catch (err) {
      // No error message shown for logout failure
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 bg-opacity-90 bg-[url('https://images.unsplash.com/photo-1579403124614-197f69d8187b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center bg-no-repeat bg-fixed flex items-center justify-center">
        <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-md mx-4 text-center border-t-8 border-blue-700">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800">Loading Voting Information</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 bg-opacity-90 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center bg-no-repeat bg-fixed px-4 py-8 relative">
      {/* Logout button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={handleLogout}
          className="bg-white border border-red-500 text-red-600 hover:bg-red-100 px-3 py-1 sm:px-4 sm:py-2 rounded-md font-semibold flex items-center text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen pt-12 sm:pt-0">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-3xl mx-4 border-t-8 border-blue-700">
          {/* Voting header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 font-serif">Constitutional Amendment Vote</h2>
            <p className="text-gray-600 text-sm sm:text-base">Exercise your democratic right</p>
          </div>

          {/* Amendment details - only show if not voted */}
          {!voted && amendmentDetails && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-blue-50 rounded-lg border-l-4 border-blue-700">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">{amendmentDetails.title}</h3>
              <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">{amendmentDetails.description}</p>
            </div>
          )}

          {/* Success message - only show after voting */}
          {message.type === 'success' && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-green-700">{message.text}</span>
              </div>
            </div>
          )}

          {/* Warning message - only for temporary issues */}
          {message.type === 'warning' && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <span className="text-yellow-700">{message.text}</span>
              </div>
            </div>
          )}

          {/* Voting interface */}
          {voted ? (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-green-600 mb-1 sm:mb-2">Vote Recorded</h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Thank you for participating in this constitutional process.</p>
              <div className="bg-gray-100 p-3 sm:p-4 rounded-lg inline-block">
                <p className="text-xs sm:text-sm text-gray-500">Your vote is confidential and will be counted in the final results.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 sm:space-y-8">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Cast Your Vote</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Select your position on the proposed amendment</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 justify-center mb-6 sm:mb-8">
                <button
                  onClick={() => setChoice('YES')}
                  className={`py-3 px-6 sm:py-4 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all ${
                    choice === 'YES' 
                      ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    VOTE YES
                  </div>
                </button>
                <button
                  onClick={() => setChoice('NO')}
                  className={`py-3 px-6 sm:py-4 sm:px-8 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all ${
                    choice === 'NO' 
                      ? 'bg-red-600 text-white shadow-lg ring-2 ring-red-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    VOTE NO
                  </div>
                </button>
              </div>

              <div className="text-center">
                <button
                  onClick={handleVote}
                  disabled={!choice}
                  className={`bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.01] shadow-md text-sm sm:text-base ${
                    !choice ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    SUBMIT SECURE VOTE
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotingPage;