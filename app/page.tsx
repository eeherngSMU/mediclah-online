"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Alert } from "@/components/ui/alert"
import Link from "next/link"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"



export default function Home() {
  const [input, setInput] = useState('')
  const [data, setData] = useState([])
  const [mechanism, setMechanism] = useState('')

  const getDrug = async () => {
    const res1 = await fetch('/api/drugbank', {
      method: 'POST',
      body: JSON.stringify({ input })
    })
    const res2 = await fetch('/api/mediview', {
      method: 'POST',
      body: JSON.stringify({ input })
    })


    const drugbankData = await res1.json()
    const mediviewData = await res2.json()

    return { drugbankData, mediviewData }

}

const getMechanism = async () => {
  const res = await fetch('/api/mechanism', {
    method: 'POST',
    body: JSON.stringify({ input })
  })


  const mechanismData = await res.json()

  return { mechanismData }
}
  const getData = async () => {
    const drugData = await getDrug() 
    setData(drugData)
    console.log('im here')
    const mData = await getMechanism()
    console.log('mechanismData', mData)
    setMechanism(mData)

  }
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('before getData')
    getData()
  }

  // useEffect(() => {
  //     getData()
      
  // }, [])




  return (
    <>
    <div className="">
      <div className="flex justify-center m-5">
        <form className="flex flex-col justify-center gap-5" onSubmit={handleSubmit}>
          <Input type='text' placeholder="Drug Name" value={input} onChange={(e) => {setInput(e.target.value)}}/>
          <div className="flex justify-center">
            <Button className="">Submit</Button>
          </div>


          
        </form>
      </div>

          <div className="flex flex-col justify-center m-5">
              <div className="flex flex-col justify-center m-5">
                  {data.drugbankData ? (
                    <div className="flex flex-col space-y-2 p-4 bg-gray-100 rounded-md shadow-md">
                      <p className="text-lg"><span className="font-semibold">Drug Name:</span> {data.drugbankData.dName}</p>
                      <br/>
                      <div className="text-lg">
                        
                        <ul className="list-none text-gray-700">
                          {data.drugbankData.dosageForms.map((form, index) => (
                            
                            <li key={index}>{form}</li>
                            
                          ))}
                        </ul>
                      </div>
                      <Link href={`https://www.drugs.com/pregnancy/${data.drugbankData.dName}.html`} target="_blank" rel="noopener noreferrer">
                        <Button>See Pregnancy Information</Button>
                      </Link>
                      
                    </div>
                  ) : (
                    <Alert variant="destructive" className="p-4 bg-red-100 text-red-700 rounded-md shadow-md">
                      Wrong name
                    </Alert>
                  )}
              </div>
                <div className="flex justify-center">
                  {data.mediviewData ? (
                    <div className="">
                    
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                    className="w-full max-w-3xl"
                  >
                    <CarouselContent className="flex justify-center">
                      {data.mediviewData.dImages.map((src, index) => (
                        <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                          <div className="p-1">
                            <Card>
                              <CardContent className="flex aspect-square items-center justify-center p-6">
                                <span className="text-3xl font-semibold">
                                  <img 
                                    key={index} 
                                    src={src} 
                                    alt={`Image ${index + 1}`} 
                                    className="w-32 h-32 object-cover rounded-md shadow-md" />
                                </span>
                              </CardContent>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>

                  </div>

                  ) : (
                    <p> No images found</p>
                  )}
                </div>
                <div>
                  <span className="font-semibold">Mechanism of action: </span>
                  { mechanism.mechanismData.dMechanism }
                </div>
              </div>
    </div>
      
    
    
    </>
  );
}
