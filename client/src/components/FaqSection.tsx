import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "./shadcn/ui/accordion"

const FaqSection = () => {
  return (
    <div className="py-8 pb-24 bg-neutral-800 text-white">
        <div className="flex items-start px-8 flex-col gap-y-1 mb-4">
            <div className="font-bold text-xl">
                FAQ (Frequently Asked Questions)
            </div>
            <div >
                Pertanyaan umum
            </div>
        </div>

        <div className="px-8">
        <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger>Apa saja fitur JalanKami?</AccordionTrigger>
            <AccordionContent>
            JalanKami mempunyai beberapa fitur. Utamanya yaitu sebagai alat deteksi kualitas dan aksesibilitas trotoar dengan otomatis menggunakan AI. Selain itu pengguna dapat mengajukan permasalahan infrastruktur yang mereka alami menggunakan form kami. Bagi para pekerja tata kota, juga dapat meringkas kualitas dan keramahan pejalan di area tertentu menggunakan alat peringkas AI kami.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
            <AccordionTrigger>Bagaimana saya bisa mengikuti status keluhan?</AccordionTrigger>
            <AccordionContent>
            Begitu keluhan sudah ditangani, akan ada email dan notifikasi yang dikirim ke akun anda.
            </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
            <AccordionTrigger>Bagaimana memberi masukan untuk JalanKami?</AccordionTrigger>
            <AccordionContent>
            Tekan tombol 'Beri Masukan' yang dicantumkan dibawah situs ini.
            </AccordionContent>
        </AccordionItem>
        </Accordion>
        </div>

    </div>
  )
}

export default FaqSection