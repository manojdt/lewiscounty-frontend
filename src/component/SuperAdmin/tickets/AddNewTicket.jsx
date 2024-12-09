import { Breadcrumbs, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NewTicketFields } from '../../../utils/super-admin-form-fields';
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import AddPlusIcon from '../../../assets/icons/add-plus-icon.svg';
import UploadIcon from '../../../assets/images/image_1x.png';
import { view } from '../../../utils/constant';
import DeleteIcon from '../../../assets/images/delete_1x.png';
import { Button } from '../../../shared';

const AddNewTicket = ({ type }) => {
  const navigate = useNavigate();
  const [filePreviews, setFilePreviews] = useState({});
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
  } = useForm();

  const breadcrumbs = [
    <Link
      variant='body2'
      underline='hover'
      key='1'
      color='inherit'
      to='/dashboard'
    >
      Dashboard
    </Link>,
    <Typography key='2' variant='body2' color={'primary'}>
      New Ticket
    </Typography>,
  ];

  const handleFileChange = (field, files) => {
    const validFiles = Array.from(files).filter((filer) =>
      [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/heic',
      ].includes(filer.type)
    );

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ...previews],
    }));

    const existingFiles = getValues(field) || [];
    setValue(field, [...existingFiles, ...validFiles]);
  };

  const handleDeleteFile = (field, index, itemId) => {
    const currentFiles = getValues(field);
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);

    const updatedPreviews = filePreviews[field]?.filter((_, i) => i !== index);
    setFilePreviews((prev) => ({ ...prev, [field]: updatedPreviews }));
    // setRemoveFiles((prev) => [...prev, itemId]);
    setValue(field, updatedFiles);
  };

  return (
    <div className='p-9'>
      <div>
        <Breadcrumbs
          className='pb-4'
          separator={<NavigateNextIcon fontSize='small' />}
          aria-label='breadcrumb'
        >
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className='border rounded-lg h-screen'>
        <div className='border-b py-4 px-2 mx-4'>
          <p className='text-lg font-semibold'>New ticket</p>
        </div>

        <div className='grid grid-cols-2 gap-4 p-6'>
          {NewTicketFields.map((field) => {
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
                    {/* {type === view.viewOnly ? (
                      <p className='text-[14px] pt-3'>
                        {getValues(field.name)}
                      </p>
                    ) : ( */}
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
                    {/* )} */}
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
              case 'checkbox':
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

              case 'date':
                return (
                  <div className={`${field.width} relative`}>
                    <label
                      className='block tracking-wide text-xs mb-2'
                      style={{ color: 'rgba(116, 116, 116, 1)' }}
                    >
                      {field.label}
                    </label>
                    <Controller
                      name='date'
                      control={control}
                      defaultValue={null}
                      rules={{ required: 'Date is required' }}
                      render={({ field }) => (
                        <Calendar
                          className='calendar-control input-bg'
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          hourFormat='12'
                          dateFormat='dd/mm/yy'
                          showIcon
                        />
                      )}
                    />
                    {errors.date && (
                      <p className='error' role='alert'>
                        {errors.date.message}
                      </p>
                    )}
                  </div>
                );
              case 'dropdown':
                return (
                  <div className={`${field.width}`}>
                    <label
                      className='block tracking-wide text-xs mb-2'
                      style={{ color: 'rgba(116, 116, 116, 1)' }}
                    >
                      {field.label}
                    </label>
                    <select
                      {...register(field.name, field.inputRules)}
                      className='w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg h-11
                             focus:border-none focus-visible:border-none focus-visible:outline-none text-[14px] h-[60px]'
                      placeholder={field.placeholder}
                      style={{
                        color: '#232323',
                        borderRight: '16px solid transparent',
                      }}
                    >
                      <option value=''>Select</option>
                      {field.options.map((option, index) => (
                        <option value={option.key} key={index}>
                          {option.value}
                        </option>
                      ))}
                    </select>
                    {errors[field.name] && (
                      <p className='error' role='alert'>
                        {errors[field.name].message}
                      </p>
                    )}
                  </div>
                );

              case 'file':
                return (
                  <>
                    {/* {type === view.viewOnly ? (
                      <>
                        <label
                          className='block tracking-wide  text-xs mb-2'
                          style={{ color: 'rgba(116, 116, 116, 1)' }}
                        >
                          {field.label}
                          {field?.inputRules?.required && '*'}
                        </label>
                        <p className='text-[14px] mb-3'>
                          {getValues(field.name)}
                        </p>
                      </>
                    ) : ( */}
                    <>
                      <div
                        className={`flex items-start flex-col justify-center w-${field.width}`}
                      >
                        <label
                          htmlFor={field.name}
                          className='tracking-wide text-xs mb-2'
                          style={{ color: 'rgba(116, 116, 116, 1)' }}
                          // className='flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600'
                        >
                          {field.label}
                          {/* <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                            <svg
                              className='w-8 h-8 mb-4 text-gray-500 dark:text-gray-400'
                              aria-hidden='true'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 20 16'
                            >
                              <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2'
                              />
                            </svg>
                            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
                              <span className='font-semibold'>
                                Upload Your Documents (Png, Img, XLS)
                              </span>
                            </p>
                          </div> */}
                          <Controller
                            name={field.name}
                            control={control}
                            defaultValue={[]}
                            render={({ field: controllerField }) => (
                              <input
                                id={field.name}
                                type='file'
                                multiple
                                accept='image/png, image/jpeg, image/jpg, image/webp, image/heic'
                                onChange={(e) =>
                                  handleFileChange(field.name, e.target.files)
                                }
                                className='hidden'
                              />
                            )}
                          />
                        </label>
                        <div
                          className={`relative w-full border-none px-3 py-[0.32rem] leading-[2.15] input-bg focus:border-none focus-visible:border-none
                                                                  focus-visible:outline-none text-[14px] h-[60px]`}
                        >
                          <div className='absolute border border-dashed border-blue-500  h-full w-48 right-0 top-0'>
                            {' '}
                            <div className='flex cursor-pointer items-center justify-center gap-2 h-full'>
                              <img src={AddPlusIcon} alt='' />{' '}
                              <span className='text-[#1D5BBF] font-semibold'>
                                Upload Image
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className='flex flex-wrap gap-4 mt-4'>
                        {filePreviews[field.name]?.map((preview, index) => (
                          <div key={index} className='relative'>
                            <img
                              src={preview}
                              alt={`Preview ${index}`}
                              className='w-24 h-24 object-cover'
                            />
                            <img
                              src={DeleteIcon}
                              alt='Delete'
                              className='absolute rounded-full top-0 right-0 w-6 h-6 cursor-pointer'
                              onClick={() =>
                                handleDeleteFile(field.name, index)
                              }
                            />
                          </div>
                        ))}
                      </div> */}

                      {/* {getValues(field.name)?.length > 0 && (
                        <>
                          <div
                            className='text-[14px] pt-5'
                            style={{ color: 'rgba(0, 0, 0, 1)' }}
                          >
                            Uploaded Image{' '}
                          </div>

                          <div className='flex flex-wrap items-center justify-start gap-2'>
                            {getValues(field.name) &&
                              getValues(field.name).map((item, index) => {
                                return (
                                  <div
                                    className='flex justify-between items-center w-[25%] mt-5 px-4 py-4'
                                    style={{
                                      border:
                                        '1px solid rgba(29, 91, 191, 0.5)',
                                      borderRadius: '3px',
                                    }}
                                  >
                                    <div className='flex gap-3 items-center'>
                                      <img src={UploadIcon} alt='altlogo' />
                                      <span className='text-[12px] w-40 truncate'>
                                        {item.name || item}
                                      </span>
                                    </div>
                                    <img
                                      className='w-[30px] cursor-pointer'
                                      onClick={() =>
                                        handleDeleteFile(
                                          field.name,
                                          index,
                                          item.props.id
                                        )
                                      }
                                      src={DeleteIcon}
                                      alt='DeleteIcon'
                                    />
                                  </div>
                                );
                              })}
                          </div>
                        </>
                      )} */}
                      {errors[field.name] && (
                        <p className='error' role='alert'>
                          {errors[field.name].message}
                        </p>
                      )}
                    </>
                    {/* )} */}
                  </>
                );

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
                      <p className='text-[14px] pt-3'>
                        {getValues(field.name) ? getValues(field.name) : '-'}
                      </p>
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
                                        field.width === 'width-82'
                                          ? 'h-[282px]'
                                          : ''
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

        <div className='flex gap-6 justify-center align-middle'>
          <Button
            btnName='Cancel'
            btnCategory='secondary'
            onClick={() => navigate('/dashboard')}
          />
          <Button
            btnType='button'
            btnCls='w-[110px]'
            btnName={'Save'}
            btnCategory='primary'
            // onClick={handleDateSelection}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNewTicket;
