import React from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { db } from '../../config/firebase';

interface FormValues {
  issueType: string;
  title: string;
  description: string;
  imgUpload?: File | null;
}

const defaultValues: FormValues = {
  issueType: '',
  title: '',
  description: '',
  imgUpload: null,
};

const IssueForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Convert file to a form-friendly format
      const formData = { 
        ...data, 
        imgUpload: data.imgUpload ? data.imgUpload.name : '' // temporary
      };
      await addDoc(collection(db, 'issues'), formData);
      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      // change to toast
    }
  };

  return (
    <div className="
        bg-white
        border
        border-black
        shadow-sm
        rounded-lg
        text-black
        px-8
        py-6
        pb-8
        flex
        flex-col
        gap-y-4
    ">
        <div className="
            w-full 
            flex 
            flex-col 
            items-start 
            gap-y-2
        ">
        <label className="text-sm">Pokok Isu</label>
        <input
            {...register('title', { required: 'Harus mengandung pokok isu' })}
            placeholder="Jembatan Layang dekat MKG"
            className="w-full text-sm px-2 py-2 border border-black rounded-md"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>
        <div className="
            w-full 
            flex 
            flex-col 
            items-start 
            gap-y-2
        ">
        <label className="text-sm">Tipe Isu</label>
        <select
          {...register('issueType', { required: 'Select an issue type' })}
          className="w-full text-sm px-2 py-2 border border-black rounded-md"
        >
            <option value="">Pilih tipe isu</option>
            <option value="broken">Infrastruktur dibutuhkan</option>
            <option value="infrastruktur">Infrastruktur kurang memadai</option>
            <option value="broken">Infrastruktur rusak</option>
            <option value="inaccessible">Infrastruktur tidak ramah difabel</option>
        </select>
        {errors.issueType && <p className="text-red-500">{errors.issueType.message}</p>}
        </div>
    <div className="
        w-full
        flex 
        flex-col 
        items-start 
        gap-y-2
    ">
        <label className="text-sm">Deskripsi</label>
        <textarea
          {...register('description', { required: 'Deskripsi diperlukan.' })}
          placeholder="Tambahkan deskripsi"
          className="w-full text-sm px-2 py-2 border border-black rounded-md"
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}
    </div>
    <div className="
        w-full 
        flex 
        flex-col 
        items-start 
        gap-y-2
    ">
        <label className="text-sm">Tambahkan foto</label>
        <input
          type="file"
          {...register('imgUpload')}
          className="w-full text-sm px-2 py-2 border border-black rounded-md"
        />
        {errors.imgUpload && <p className="text-red-500">{errors.imgUpload.message}</p>}
    </div>

      <div
        onClick={handleSubmit(onSubmit)}
        className="
          flex
          justify-center
          rounded-lg
          border-1
          border-neutral-600
          border-2
          text-white
          bg-neutral-800
          py-2
          px-4
          cursor-pointer
          mt-4
          hover:opacity-80
          transition
        ">
        Kirim laporan
      </div>
    </div>
  );
};

export default IssueForm;