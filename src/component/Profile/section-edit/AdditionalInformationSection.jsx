import React from 'react';
import { AdditionalInformationFields } from '../../../utils/formFields';
import { Controller, useFormContext } from 'react-hook-form';
import { view } from '../../../utils/constant';

const AdditionalInformationSection = ({ type }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
  } = useFormContext();

  return (
    <div className='grid grid-cols-1 gap-6'>
      {AdditionalInformationFields.map((field) => {
        switch (field.type) {
          case 'textbox':
            return (
              <div
                key={field.name}
                className={`${field.width}`}
                style={{ marginBottom: '16px' }}
              >
                <label
                  className='block tracking-wide  text-xs mb-2'
                  style={{ color: 'rgba(116, 116, 116, 1)' }}
                >
                  {field.label}
                  {field?.inputRules?.required && '*'}
                </label>
                {type === view.viewOnly ? (
                  <p className='text-[14px] pt-3'>{getValues(field.name)}</p>
                ) : (
                  <Controller
                    name={field.name}
                    control={control}
                    defaultValue=''
                    rules={field.inputRules}
                    render={({ field: controllerField }) => (
                      <textarea
                        id='message'
                        rows='4'
                        className={`block p-2.5 input-bg w-full text-sm text-gray-900  rounded-lg border
                      focus:visible:outline-none focus:visible:border-none ${
                        field.width === 'width-82' ? 'h-[282px]' : ''
                      }`}
                        placeholder={field.placeholder}
                        {...register(field.name, field.inputRules)}
                      />
                    )}
                  />
                )}
                {errors[field.name] && (
                  <p style={{ color: 'red', fontSize: '12px' }}>
                    {errors[field.name]?.message}
                  </p>
                )}
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};

export default AdditionalInformationSection;
