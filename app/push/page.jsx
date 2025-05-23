"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileXIcon } from 'lucide-react';
import useSWR, { useSWRConfig } from 'swr';
import { DialogBody } from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import { useEffect, useState } from 'react';
import { send_notification} from '@/lib/push'
import {key} from './key'
const PUSH_URL = "/api/push/"


export default function Home() {
    const { mutate } = useSWRConfig()
    function urlBase64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4)
        var base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/')

        var rawData = window.atob(base64)
        var outputArray = new Uint8Array(rawData.length)

        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i)
        }
        return outputArray;
    }
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState(
        null
    )
    const [message, setMessage] = useState('')

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }
    }, [])
    async function registerServiceWorker() {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
            updateViaCache: 'none',
        })
        const sub = await registration.pushManager.getSubscription()
        setSubscription(sub)
    }
    var applicationServerKey = key;

    async function subscribeUser() {
        console.log(isSupported, navigator, window)
        if (isSupported) {
            console.log("tQyes")
            const reg = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            })
            
            const sub = await reg.pushManager
                .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(
                        applicationServerKey
                    ),
                })
            var registration_id = sub.endpoint;
            var data = {
                p256dh: btoa(
                    String.fromCharCode.apply(
                        null,
                        new Uint8Array(sub.getKey('p256dh'))
                    )
                ),
                auth: btoa(
                    String.fromCharCode.apply(
                        null,
                        new Uint8Array(sub.getKey('auth'))
                    )
                ),
                registration_id: registration_id,
            }
            setSubscription(sub)
            requestPOSTToServer(data)
                .catch(function (e) {
                    if (Notification.permission === 'denied') {
                        console.warn('Permission for notifications was denied')
                    } else {
                        console.error('Unable to subscribe to push', e)
                    }
                })
        }
    }
    async function sendTest(push_obj_id){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        fetch(`${PUSH_URL}/${push_obj_id}`, requestOptions)
    }
    

    async function setCurrent(push_obj_id){
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
        fetch(`${PUSH_URL}/set/${push_obj_id}`, requestOptions)
    }
    

    
    // Send the subscription data to your server
    async function requestPOSTToServer(data) {
        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        data['name'] = document.getElementById('nameInput').value
        const requestOptions = {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        };

        const response = await (
            fetch(
                'api/push/',
                requestOptions
            )
        );
        return await response.json();
    }

    async function deletePushObj(push_obj) {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
        }
        const response = await fetch(`${PUSH_URL}/${push_obj}`, requestOptions)
        mutate(PUSH_URL)
    }

    const fetcher = async url => {
        const res = await fetch(url);

        if (!res.ok) {
            const error = new Error('Something went wrong');
            error.info = await res.json();
            error.status = res.status;
            throw error;
        }
        return res.json();
    }
    const { data, error, isLoading } = useSWR(PUSH_URL, fetcher);
    if (isLoading) {
        return (<p>test</p>)
    }
    if (!isLoading) {
        console.log(data, error)
    }
    return (
        <div>
            <div>
                <div className='mb-5 mt-5 flex gap-5 items-baseline  '>
                    <Label>Device Name</Label>
                    <input id='nameInput'></input>
                </div>
                <Button onClick={subscribeUser}> Subscribe to push notifications</Button>

            </div>
            <div className='mt-5'>
                {data?.data.map((pushObj, id) => (
                    <div className='mb-5' key={`pushObj-${id}`}>
                        <span>{pushObj.name}</span>
                        <Button onClick={() => sendTest(pushObj.id)} className='ml-5 bg-card-foreground'>Push</Button>
                        <Button onClick={() => setCurrent(pushObj.id)} className='ml-5 bg-card-foreground'>Set Current</Button>
                        <Dialog>
                            <DialogTrigger>
                                <FileXIcon className={'ml-5 w-1/3 inline'} />
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete this item </DialogTitle>
                                </DialogHeader>

                                <DialogBody>
                                    <p>Are you sure you want to delete this item?</p>
                                    <DialogClose asChild>
                                        <Button type={"button"} className={'ml-auto  mr-auto block mt-5'}
                                            onClick={() => deletePushObj(pushObj.id)}>
                                            Submit
                                        </Button>
                                    </DialogClose>
                                </DialogBody>
                            </DialogContent>
                        </Dialog>
                    </div>
                ))}
            </div>
        </div>

    )
}