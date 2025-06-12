import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type ConfirmModalProps = {
  message: string | null,
  inputCode: string | undefined,
  codeModal: boolean | null,
  setInputCode: (inputCode: string) => void,
  onConfirm: () => void,
  onCancel: () => void,
};

export const ConfirmModal = ({ message, inputCode, codeModal, setInputCode, onConfirm, onCancel}: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-[var(--primary-brad-2)] p-6 rounded-lg shadow-xl text-white max-w-md text-center space-y-4">
        <p className="text-lg">{message}</p>
        {codeModal ===true && (
          <div className="flex justify-center ">
            <InputOTP 
              maxLength={6}
              value={inputCode}
              onChange={(inputCode)=>{setInputCode(inputCode)}}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        )}
        
        <div className="flex justify-around">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
