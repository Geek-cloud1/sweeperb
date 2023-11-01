const { ethers } = require('ethers')

const provider = new ethers.providers.JsonRpcProvider('https://rpc.eth.haqq.network')





const addressReceiver = '0x1ed412749e2dc2B741E8B9b0eedd4513c51EB693'

const privateKeys = ["e44efe785111b6f07222a2aa59fb8fb6bd525933375f32a3fe6a0830666665f3"]

const bot = async =>{



    provider.on('block', async () => {
        try {


            console.log('Listening to new block, waiting ;)');

            for (let i = 0; i < privateKeys.length; i++) {

                const _target = new ethers.Wallet(privateKeys[i]);
                const target = _target.connect(provider);
                const balance = await provider.getBalance(target.address);
                console.log(balance.toString())

                
                const gasPrice = await provider.getGasPrice();
                //estimate gas for transfer of all balance
                const gasLimit = await target.estimateGas({
                    to: addressReceiver,
                    value: balance
                });
                console.log(gasLimit);
                const gas1 = gasLimit.mul(5)
                const gas2 = gas1.div(3)
                const totalGasCost = gas2.mul(gasPrice);
                console.log(totalGasCost);
                if (balance.sub(totalGasCost) > 0) {
                    console.log("Account got ISLM!, i sent it out");
                    const amount = balance.sub(totalGasCost);

                    try {
                        await target.sendTransaction({
                            to: addressReceiver,
                            value: amount


                        });
                        console.log(`Success! transferred -->${ethers.utils.formatEther(amount)}`); //replaced the balance to amount
                    } catch (e) {
                        console.log(`error: ${e}`);
                    }
                }

            }
        }
        catch (err){
            console.log(err)
        }
    })
}

bot();
