const registers = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    H: 0,
    L: 0,
};
const flag={
    S:0,
    Z:0,
    AC:0,
    P:0,
    CY:0,
};function checkParity(temp) {
    let count = 0;
    let t = temp.toString(); // Convert temp to string
    for (let i = 0; i < t.length; i++) {
        let bit = parseInt(t[i], 10); // Parse each character of the string
        if (bit) {
            count++;
        }
    }
    return count % 2 === 0;
}

const memory = [];
const arithmeticFunctions = {
    ADD: (srcReg) => {
        registers["A"] += registers[srcReg];
        if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
        else flag["CY"]=0;
        flag["Z"]=registers["A"]==0?1:0;
        flag["S"]=registers["A"]<0?1:0;
        flag["P"]=checkParity(registers["A"]);
    },
    MADD: (address) => {
        registers["A"] += memory[address];
        if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
        else flag["CY"]=0;
        flag["Z"]=registers["A"]==0?1:0;
        flag["S"]=registers["A"]<0?1:0;
        flag["P"]=checkParity(registers["A"]);
},
    ADC:(srcReg)=>{
        registers["A"]+=flag["CY"]+registers[srcReg];
        if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
        else flag["CY"]=0;
        flag["Z"]=registers["A"]==0?1:0;
        flag["S"]=registers["A"]<0?1:0;
        flag["P"]=checkParity(registers["A"]);
},
    MADC: (address) => {
        registers["A"] +=flag["CY"]+memory[address];
        if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
        else flag["CY"]=0;
        flag["Z"]=registers["A"]==0?1:0;
        flag["S"]=registers["A"]<0?1:0;
        flag["P"]=checkParity(registers["A"]);
},
    ADI:(data)=>{
        registers["A"]+=data;
        if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
        else flag["CY"]=0;
        flag["Z"]=registers["A"]==0?1:0;
        flag["S"]=registers["A"]<0?1:0;
        flag["P"]=checkParity(registers["A"]);
},
    ACI:(data)=>{
        registers["A"]+=flag["CY"]+data;
        if(registers["A"]>255){flag["CY"]=1;registers["A"]=255;}
        else flag["CY"]=0;
        flag["Z"]=registers["A"]==0?1:0;
        flag["S"]=registers["A"]<0?1:0;
        flag["P"]=checkParity(registers["A"]);
},
    DAD: (regPair) => {
        const hlValue = (registers["H"] << 8) | registers["L"];
        const rpValue = (registers[regPair[0]] << 8) | registers[regPair[1]];
        const result = hlValue + rpValue;
        registers["H"] = (result & 0xFF00) >> 8;
        registers["L"] = result & 0x00FF;
        if (result > 0xFFFF) {flag["CY"]=1;result=65535;}
        else flag["CY"] =0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    SBB: (srcReg) => {
        const carry =flag["CY"];
        const result = registers["A"] - registers[srcReg] - carry;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
        flag["CY"]=result<0 || result>255?1:0;
        registers["A"]=result;
    },
    SUI: (data) => {
        const carry =flag["CY"];
        const result = registers["A"] - data - carry;
        flag["CY"]=result<0 || result>255?1:0;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
        registers["A"] = result;
    },
    SBI: (data) => {
        const carry = flag["CY"];
        const result = registers["A"] - (data + carry);
        flag["CY"]=result<0 || result>255?1:0;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
        registers["A"] = result;
    },
    SUB: (srcReg) => {
        registers["A"] -= registers[srcReg];
        const result=registers["A"];
        flag["CY"]=result<0 || result>255?1:0;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MSUB: (address) =>{
        registers["A"] -= memory[address];
        const result=registers["A"];
        flag["CY"]=result<0 || result>255?1:0;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    INR: (reg) => {
        registers[reg]++;
        const result=registers[reg];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    INX: (regPair) => {
        const regPairValue = (registers[regPair[0]] << 8) | registers[regPair[1]];
        regPairValue++;
        registers[regPair[0]] = (regPairValue & 0xFF00) >> 8;
        registers[regPair[1]] = regPairValue & 0x00FF;
        const result=regPairValue;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MINR: (address) => {
        memory[address]++;
        const result=memory[address];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    DCR: (reg) => {
        registers[reg]--;
        const result=registers[reg];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MDCR: (address) => {
        memory[address]--;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    DCX: (regPair) => {
        const regPairValue = (registers[regPair[0]] << 8) | registers[regPair[1]];
        regPairValue--;
        registers[regPair[0]] = (regPairValue & 0xFF00) >> 8;
        registers[regPair[1]] = regPairValue & 0x00FF;
        const result=regPairValue;
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
};

const move={
    MOV:(srcReg,desReg)=>{registers[desReg]=registers[srcReg];},
    MMOV:(desReg,address)=>{reg[desReg]=memory[address];},
    IMOV:(desReg,data)=>{registers[desReg]=data;},
    // MMVI:(address,data)=>{memory[address]=data;},
    MVI:(srcReg,data)=>{registers[srcReg]=data;},
    LXI: (destRegPair, data) => { registers[destRegPair[0]] = (data & 0xFF00) >> 8; registers[destRegPair[1]] = data & 0x00FF; },
    LDA: (address) => { registers["A"] = memory[address]; },
    LDAX: (regPair) => { registers["A"] = memory[(registers[regPair[0]] << 8) | registers[regPair[1]]]; },
    LHLD:(address)=>{registers["L"]=memory[address];registers["H"]=memory[address+1];},
    STA:(address)=>{memory[address]=registers["A"];},
    STAX:(regPair)=>{memory[registers[regPair[1]]+registers[regPair[0]]]=registers["A"];},
    SHLD:(address)=>{memory[address]=registers["L"];memory[address+1]=registers["H"];},
    XCHG: () => { [registers["H"], registers["D"]] = [registers["D"], registers["H"]]; [registers["L"], registers["E"]] = [registers["E"], registers["L"]]; },
};

const logicFunctions = {
    CMP:(srcReg)=>{
        const result = registers["A"]-registers[srcReg];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MCMP:(address)=>{
        const result = registers["A"]-memory[address];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    CPI:(data)=>{
        const result = registers["A"]-data;
        if(result<0)flag["CY"]=1;
        else if(result==0)flag["Z"]=1;
        else {flag["Z"]=0;flag["CY"]=0;};
    },
    ANA: (srcReg) => {
        registers["A"] &= registers[srcReg];
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MANA: (address) => {
        registers["A"] &= memory[address];
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    ANI: (data) => {
        registers["A"] &= data;
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    ORA: (srcReg) => {
        registers["A"] |= registers[srcReg];
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MORA: (address) => {
        registers["A"] |= memory[address];
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    ORI: (data) => {
        registers["A"] |= data;
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    XRA: (srcReg) => {
        registers["A"] ^= registers[srcReg];
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    MXRA: (address) => {
        registers["A"] ^= memory[address];
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    XRI: (data) => {
        registers["A"] ^= data;
        const result=registers["A"];
        flag["S"]=result<0?1:0;
        flag["Z"]=result==0?1:0;
        flag["P"]=checkParity(result);
    },
    RLC: () => {
        const msb = (registers["A"] & 0x80) >> 7;
        registers["A"] = ((registers["A"] << 1) | flag["CY"]) & 0xFF;
        flag["CY"] = msb;
    },
    RRC: () => {
        const lsb = registers["A"] & 0x01;
        registers["A"] = (registers["A"] >> 1) | (flag["CY"] << 7);
        flag["CY"] = lsb;
    },
    RAL: () => {
        const msb = (registers["A"] & 0x80) >> 7;
        registers["A"] = ((registers["A"] << 1) | flag["CY"]) & 0xFF;
        flag["CY"] = msb;
    },
    RAR: () => {
        const lsb = registers["A"] & 0x01;
        registers["A"] = (registers["A"] >> 1) | (flag["CY"] << 7);
        flag["CY"] = lsb;
    },
    CMA: () => {
        registers["A"] = ~registers["A"] & 0xFF;
    },
    CMC: () => {
        flag["CY"] = flag["CY"] ? 0 : 1;
    },
    STC: () => {
        flag["CY"] = 1;
    },
}

const branchingFunction={
    JMP:(Newaddress) => {address=Newaddress;},
    JC:(Newaddress) => {if(flag["CY"]==1)address=Newaddress;},
    JNC:(Newaddress) => {if(flag["CY"]==0)address=Newaddress;},
    JP:(Newaddress) => {if(flag["S"]==0)address=Newaddress;},
    JM:(Newaddress) => {if(flag["S"]==1)address=Newaddress;},
    JZ:(Newaddress) => {if(flag["Z"]==1)address=Newaddress;},
    JNZ:(Newaddress) => {if(flag["Z"]==0)address=Newaddress;},
    JPE:(Newaddress)=>{if(flag["P"]==1)address=Newaddress;},
    JPO:(Newaddress)=>{if(flag["P"]==0)address=Newaddress;},

    CALL:(Newaddress) => {
        stack.push(address);
        address=Newaddress;
    },
    CC:(Newaddress)=>{if(flag["CY"]==1){
        stack.push(address);
        address=Newaddress;}
    },
    CNC:(Newaddress)=>{if(flag["CY"]==1){
        stack.push(address);
        address=Newaddress;}
    },
    CP:(Newaddress)=>{if(flag["S"]==0){
        stack.push(address);
        address=Newaddress;}
    },
    CM:(Newaddress)=>{if(flag["S"]==0){
        stack.push(address);
        address=Newaddress;}
    },
    CZ:(Newaddress)=>{if(flag["Z"]==1){
        stack.push(address);
        address=Newaddress;}
    },
    CNZ:(Newaddress)=>{if(flag["Z"]==0){
        stack.push(address);
        address=Newaddress;}
    },
    CPE:(Newaddress)=>{if(flag["P"]==1){
        stack.push(address);
        address=Newaddress;}
    },
    CPO:(Newaddress)=>{if(flag["P"]==0){
        stack.push(address);
        address=Newaddress;}
    },

    RET: () => {
        address=stack.pop();
    },
    RC:(Newaddress)=>{if(flag["CY"]==1){address=Newaddress;}},
    RNC:(Newaddress)=>{if(flag["CY"]==0){address=Newaddress;}},
    RP:(Newaddress)=>{if(flag["S"]==0){address=Newaddress;}},
    RM:(Newaddress)=>{if(flag["S"]==1){address=Newaddress;}},
    RZ:(Newaddress)=>{if(flag["Z"]==1){address=Newaddress;}},
    RNZ:(Newaddress)=>{if(flag["Z"]==0){address=Newaddress;}},
    RPE:(Newaddress)=>{if(flag["P"]==1){address=Newaddress;}},
    RPO:(Newaddress)=>{if(flag["P"]==0){address=Newaddress;}},

    RST0:()=>{address=0;},
    RST1:()=>{address=8;},
    RST2:()=>{address=10;},
    RST3:()=>{address=18;},
    RST4:()=>{address=20;},
    RST5:()=>{address=28;},
    RST6:()=>{address=30;},
    RST7:()=>{address=38;},

    HLT: () => { halted = true; },
    DI: () => { interruptsEnabled = false; },
    EI: () => { interruptsEnabled = true; }
}