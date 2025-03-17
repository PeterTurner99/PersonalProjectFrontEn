"use client"

import useSWRMutation from "swr/mutation";
import { useEffect, useState } from "react";
const INGREDIENTS_REQUIRED_URL = '/api/ingredients/required/'



export default function Page() {
    async function update_ingredients_search(url, { arg }) {
        const res = await fetch(`${url}${arg}`)
        const res_json = await res.json()
        let error = undefined
        let ingredient_json = {}
        if (!res.ok) {
            const errorInfo = res_json;
            error = new Error(errorInfo);
            error.info = errorInfo;
            error.status = res.status;
            if (res.status === 404) {
                error.message = "Menus not found"
            }
        }
        else {

            ingredient_json = JSON.parse(res_json.ingredients)
            res_json.ingredients = ingredient_json
        }
        console.log(res_json)
        return { data: res_json, error: error }
    }


    let {
        data,
        error,
        isMutating,
        trigger
    } = useSWRMutation(`${INGREDIENTS_REQUIRED_URL}?search=`, update_ingredients_search);
    if (!data && !error && !isMutating) {
        console.log('tres')
        trigger('')
    }
    if (!data) {
        return <div>Loading...</div>
    }
    console.log(Object.keys(data?.data.ingredients))
    return (
        <div className={" overflow-scroll"}>
            {(Object.keys((data.data.ingredients))).map((ingredient, index) => (
                <div key={`ingredient-${index}`}>
                    <p className={"mb-4"}> <span className={" underline mr-3  "}>{ingredient}:</span>  {Object.keys(data.data.ingredients[ingredient]).map((amount, index) => (
                        <span key={`amount-${index}`}>
                            {data.data.ingredients[ingredient][amount]} {amount}
                        </span>
                    ))}</p>
                </div>
            ))
            }
        </div>
    )
}