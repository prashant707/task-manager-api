const { add,calculateTip,celsiusToFahrenheit,fahrenheitToCelsius }=require('../src/math')

test('Should calculate total with tip',()=>{

    const total=calculateTip(10,.3);
    expect(total).toBe(13)
    expect(calculateTip(10)).toBe(12.5)
    // if(total!==13){
    //     throw new Error('Total tip should be 13, not '+total)
    // }
})

test('Should calculate tip with top when tip is not provide',()=>{
    const total=calculateTip(10);
    expect(total).toBe(12.5)
})

test('Should calculate celsius to fahrenheit',()=>{
    const temp=celsiusToFahrenheit(100);
    expect(temp).toBe(212)
})

test('Should calculate fahrenheit to celsisu',()=>{
    const temp=fahrenheitToCelsius(100);
    expect(Math.round(temp*10)/10).toBe(37.8)
})

test('Async test done',(done)=>{
    setTimeout(() => {
        expect(1).toBe(1);
        done();
    }, 2000);
    
})

test('Should add two numbers ',(done)=>{
    add(2,3).then((sum)=>{
        expect(sum).toBe(5);
        done();
    })
})

test('Should add two number async/await',async()=>{
    const sum=await add(10,22)
    expect(sum).toBe(32)
})