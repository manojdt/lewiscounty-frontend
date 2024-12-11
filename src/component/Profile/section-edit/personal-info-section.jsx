import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { PersonalInfoFields } from '../../../utils/formFields';
import { view } from '../../../utils/constant';

const PersonalInfoSection = ({ type, getValues }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    // getValues,
    setValue,
  } = useFormContext();

  return (
    <div className='grid grid-cols-6 gap-6'>
      {PersonalInfoFields.map((field) => {
        switch (field.type) {
          case 'input':
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
                      <input
                        {...register(field.name, field.inputRules)}
                        type={field.fieldtype}
                        className='w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none
                                                          focus-visible:outline-none text-[14px] h-[60px]'
                        placeholder={field.placeholder}
                        style={{
                          color: '#232323',
                          borderRadius: '3px',

                          paddingLeft: '10px',
                        }}
                        disabled={field.disabled}
                        aria-invalid={!!errors[field.name]}
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

          case 'radio':
            return (
              <div
                key={field.name}
                className={`${field.width}`}
                style={{ marginBottom: '16px' }}
              >
                <label
                  className='block tracking-wide text-xs mb-2'
                  style={{ color: 'rgba(116, 116, 116, 1)' }}
                >
                  {field.label}
                </label>
                <Controller
                  name={field.name}
                  control={control}
                  defaultValue=''
                  rules={field.inputRules}
                  render={({ field: controllerField }) => (
                    <div className='flex items-center justify-start gap-6 mt-6'>
                      {field.options.map((option) => (
                        <label
                          className='flex items-center justify-center gap-1'
                          key={option.key}
                          style={{ marginRight: '8px' }}
                        >
                          <input
                            type='radio'
                            value={option.value}
                            checked={controllerField.value === option.value}
                            onChange={(e) =>
                              controllerField.onChange(e.target.value)
                            }
                          />
                          {option.value}
                        </label>
                      ))}
                    </div>
                  )}
                />
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

export default PersonalInfoSection;
