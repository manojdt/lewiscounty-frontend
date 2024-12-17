import React from 'react';
import MuiModal from '../../../shared/Modal';

const TicketRejectModal = ({ setIsOpen, isOpen }) => {
  // const [reason, setReason] = useState('');

  return (
    <MuiModal
      modalOpen={isOpen}
      modalClose={setIsOpen}
      title='Ticket Reject Reason'
    >
      {/* Modal Body */}
      <div className='p-4'>
        <label htmlFor='reason' className='block text-gray-700 font-medium'>
          Reason
        </label>
        <textarea
          id='reason'
          className='mt-2 w-full h-32 p-3 border-2 border-red-200 rounded-md bg-red-50 focus:ring focus:ring-red-200 transition duration-300'
          placeholder='Enter Reason...'
        ></textarea>
      </div>

      {/* Modal Footer */}
      <div className='p-4 flex justify-end gap-4'>
        <button
          className='px-6 py-2 border border-gray-400 rounded-md text-gray-600 hover:bg-gray-100 transition duration-200'
          onClick={() => setIsOpen(false)}
        >
          No
        </button>
        <button
          className='px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition transform duration-200 hover:scale-105'
          onClick={() => {
            // console.log('Reason:', reason);
          }}
        >
          Yes
        </button>
      </div>
    </MuiModal>
  );
};

export default TicketRejectModal;
