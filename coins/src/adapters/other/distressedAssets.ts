import getBlock from "../utils/block";
import { getTokenInfo } from "../utils/erc20";
import { Write } from "../utils/dbInterfaces";
import { addToDBWritesList } from "../utils/database";
import { getCurrentUnixTimestamp } from "../../utils/date";

export const contracts: { [chain: string]: { [token: string]: string } } = {
  ethereum: {
    GVR: "0x84FA8f52E437Ac04107EC1768764B2b39287CB3e",
    PSY_SCAM: "0xe5a2363904d91c6a311a378537b29c7c6d4f230d",
    GVR_OLD: "0xF33893DE6eB6aE9A67442E066aE9aBd228f5290c",
    XRPC: "0xd4ca5c2aff1eefb0bea9e9eab16f88db2990c183",
    LUFFY: "0x54012cdf4119de84218f7eb90eeb87e25ae6ebd7",
    LUFFY_NEW: "0x7121d00b4fa18f13da6c2e30d19c04844e6afdc8",
    FEG: "0x389999216860ab8e0175387a0c90e5c52522c945",
    yUSDT: "0x83f798e925bcd4017eb265844fddabb448f1707d",
    yUSDT_v1: "0xe6354ed5bc4b393a5aad09f21c46e101e692d447",
    ycUSDT_v1: "0x1be5d71f2da660bfdee8012ddc58d024448a0a59",
    yUSDT_yDAI_yUSDT_BUSD: "0x2994529c0652d127b7842094103715ec5299bbed",
    crv_yUSDT_yDAI_yUSDT_BUSD: "0x3b3ac5386837dc563660fb6a0937dfaa5924333b",
    ypaxCrv: "0xd905e2eaebe188fc92179b6350807d8bd91db0d8",
    "yDAI+yUSDC+yUSDT+yTUSD": "0xdf5e0e81dff6faf3a7e52ba697820c5e32d806a8",
    "yyDAI+yUSDC+yUSDT+yTUSD": "0x5dbcf33d8c2e976c6b560249878e6f1491bca25c",
    yUSD: "0x4b5bfd52124784745c1071dcb244c6688d2533d3",
    YAM: "0x0e2298e3b3390e3b945a5456fbf59ecc3f55da16",
    PAW: "0x1aa51bc7eb181ce48ce626bf62f8956fa9555136",
    multiBTC: "0x66eff5221ca926636224650fd3b9c497ff828f7d",
    FEVR: "0x9fb83c0635de2e815fd1c21b3a292277540c2e8d",
    TENET: "0x9663677b81c2d427e81c01ef7315ea96546f5bb1",
    PLQ: "0xd23ed8ca350ce2631f7ecdc5e6bf80d0a1debb7b",
    MINTME: "0x772722b55cdc2a086abd064267a17855eb15e8b3",
    GRAIN: "0xf88baf18fab7e330fa0c4f83949e23f52fececce",
    "pETH-ETH-f": "0x9848482da3ee3076165ce6497eda906e66bb85c5",
    "msETH-ETH-f": "0xc897b98272aa23714464ea2a0bd5180f1b8c0025",
    FUNB: "0xd86c0b9b686f78a7a5c3780f03e700dbbad40e01",
  },
  harmony: {
    Frax: "0xeB6C08ccB4421b6088e581ce04fcFBed15893aC3",
    WrappedEther: "0xF720b7910C6b2FF5bd167171aDa211E226740bfe",
    Aave: "0xcF323Aad9E522B93F11c352CaA519Ad0E14eB40F",
    Sushi: "0xBEC775Cb42AbFa4288dE81F387a9b1A3c4Bc552A",
    FXS: "0x775d7816afbEf935ea9c21a3aC9972F269A39004",
    AAG: "0xAE0609A062a4eAED49dE28C5f6A193261E0150eA",
    BUSD: "0xE176EBE47d621b984a73036B9DA5d834411ef734",
    DAI: "0xEf977d2f931C1978Db5F6747666fa1eACB0d0339",
    Tether: "0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f",
    WBTC: "0x3095c7557bCb296ccc6e363DE01b760bA031F2d9",
    USDC: "0x985458E523dB3d53125813eD68c274899e9DfAb4",
    ETH: "0x6983D1E6DEf3690C4d616b13597A09e6193EA013",
    bscBNB: "0xb1f6E61E1e113625593a22fa6aa94F8052bc39E0",
    bscBUSD: "0x0aB43550A6915F9f67d0c454C2E90385E6497EaA",
    BIFI: "0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8",
  },
  klaytn: {
    USDK: "0xd2137fdf10bd9e4e850c17539eb24cfe28777753",
  },
  arbitrum: {
    GOLD: "0xc4be0798e5b5b1C15edA36d9B2D8c1A60717fA92",
    MIM: "0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a",
    BIFI: "0x99c409e5f62e4bd2ac142f17cafb6810b8f0baae",
    MINTME: "0x7d05d38e6109a3aeeebf0a570eb8f6856cb4b55e",
    GRAIN: "0x80bb30d62a16e1f2084deae84dc293531c3ac3a1",
  },
  bsc: {
    aBNBb: "0xbb1aa6e59e5163d8722a122cd66eba614b59df0d",
    aBNBc: "0xe85afccdafbe7f2b096f268e31cce3da8da2990a",
    DOGECOLA: "0xe320df552e78d57e95cf1182b6960746d5016561",
    GVR: "0xaFb64E73dEf6fAa8B6Ef9a6fb7312d5C4C15ebDB",
    GVR2: "0xF33893DE6eB6aE9A67442E066aE9aBd228f5290c",
    PANCAKE_LP_ABNB_BNB: "0x272c2CF847A49215A3A1D4bFf8760E503A06f880",
    BTCBR: "0x0cf8e180350253271f4b917ccfb0accc4862f262",
    RB: "0x441bb79f2da0daf457bad3d401edb68535fb3faa",
    MOR: "0x87bade473ea0513d4aa7085484aeaa6cb6ebe7e3",
    $CINO: "0xdfe6891ce8e5a5c7cf54ffde406a6c2c54145f71",
    VBSWAP: "0x4f0ed527e8a95ecaa132af214dfd41f30b361600",
    ZEDXION: "0xfbc4f3f645c4003a2e4f4e9b51077d2daa9a9341",
    FEG: "0xacfc95585d80ab62f67a14c566c1b7a49fe91167",
    MFI: "0xeb5bb9d14d27f75c787cf7475e7ed00d21dc7279",
    BLT: "0x449aed32c1685dbeca28d1ae45462b6156a6096d",
    multiBTC: "0xd9907fcda91ac644f70477b8fc1607ad15b2d7a8",
    DERC: "0x373e768f79c820aa441540d254dca6d045c6d25b",
    LMT: "0x9617857e191354dbea0b714d78bc59e57c411087",
    DHV: "0x58759dd469ae5631c42cf8a473992335575b58d7",
    MIMIR: "0x336f5a68fd46a25056a6c1d9c06072c691486acc",
    BCDT: "0x8683e604cdf911cd72652a04bf9d571697a86a60",
    DEP: "0xcaf5191fc480f43e4df80106c7695eca56e48b18",
    DOSE: "0x7837fd820ba38f95c54d6dac4ca3751b81511357",
    ORBS: "0xebd49b26169e1b52c04cfd19fcf289405df55f80",
    TCS: "0x3447ac4ad1153ba762034ee7b8ac637c553a9134",
    MIM: "0xfe19f0b51438fd612f6fd59c1dbb3ea319f433ba",
    TOMOE: "0x9a6d5c2e0376572f214a35f832740e412932d277",
    bCOLX: "0xf8acf86194443dcde55fc5b9e448e183c290d8cb",
    FODL: "0x43f5b29d63cedc5a7c1724dbb1d698fde05ada21",
    LIQR: "0x33333ee26a7d02e41c33828b42fb1e0889143477",
    PLQ: "0x9c08951397bc02cd66f69eadbb8d491f8bb08c5e",
    MINTME: "0x138218c8e064ed2a011c9ff203759a8a1e23e6c8",
    GRAIN: "0x8f87a7d376821c7b2658a005aaf190ec778bf37a",
    FITFI: "0x7588df009c3d82378be6ab81f2108fa963c10fc8",
  },
  cronos: {
    CRK: "0x065de42e28e42d90c2052a1b49e7f83806af0e1f",
    MINTME: "0xd652776de7ad802be5ec7bebfafda37600222b48",
  },
  solana: {
    YAKU: "NGK3iHqqQkyRZUj4uhJDQqEyKKcZ7mdawWpqwMffM3s",
    SNS: "SNSNkV9zfG5ZKWQs6x4hxvBRV6s8SqMfSGCtECDvdMd",
    PEEP: "n54ZwXEcLnc3o7zK48nhrLV4KTU5wWD4iq7Gvdt5tik",
    WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    GUAC: 'AZsHEMXd36Bj1EMNXhowJajpUXzrKcK57wW4ZGXVa7yR',
    OVOL: '4v3UTV9jibkhPfHi5amevropw6vFKVWo7BmxwQzwEwq6'
  },
  avax: {
    DUEL: "0xc1a49c0b9c10f35850bd8e15eaef0346be63e002",
    ApeU: "0x6b0d2a3c37d551963275bB104F045F6a68AB6374",
    iBFR: "0xcaf870dad882b00f4b20d714bbf7fceada5e4195",
    BIFI: "0xd6070ae98b8069de6b494332d1a1a81b6179d960",
    ORBS: "0x340fe1d898eccaad394e2ba0fc1f93d27c7b717a",
    BCDT: "0xafb2780cbb58b2af27023eb2a0e60c8ca0eee9bb",
    DEP: "0xd4d026322c88c2d49942a75dff920fcfbc5614c1",
    LIQR: "0x33333ee26a7d02e41c33828b42fb1e0889143477",
    GRAIN: "0x9df4ac62f9e435dbcd85e06c990a7f0ea32739a9",
  },
  oasis: {
    USDT: "0x6Cb9750a92643382e020eA9a170AbB83Df05F30B",
    USDC: "0x94fbffe5698db6f54d6ca524dbe673a7729014be",
  },
  fantom: {
    CoUSD: "0x0DeF844ED26409C5C46dda124ec28fb064D90D27",
    DEI: "0x91f7120898b4be26cC1e84F421e76725c07d1361",
    multiUSDC: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    miMATIC: "0xfb98b335551a418cd0737375a2ea0ded62ea213b",
    fUSDT: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
    WETH: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    BTC: "0x321162cd933e2be498cd2267a90534a804051b11",
    ETH: "0x74b23882a30290451a17c44f4f05243b6b58c76d",
    USDC: "0x04068da6c83afcfa0e13ba15a6696662335d5b75",
    "0xMR": "0xab41861399eb56896b24fbaabaa8bce45e4a626b",
    MIMO: "0x1d1764f04de29da6b90ffbef372d1a45596c4855",
    DEP: "0x8dfdc61c7c7551d0deec950a2822eb59cddb8f59",
    sSPELL: "0xbb29d2a58d880af8aa5859e30470134deaf84f2b",
    LIQR: "0x33333ee26a7d02e41c33828b42fb1e0889143477",
    BELUGA: "0x4a13a2cf881f5378def61e430139ed26d843df9a",
    MIM: "0x82f0b8b456c1a451378467398982d4834b6829c1",
    UST: "0xe2d27f06f63d98b8e11b38b5b08a75d0c8dd62b9",
    BIFI: "0xd6070ae98b8069de6b494332d1a1a81b6179d960",
    LUNA: "0x95dd59343a893637be1c3228060ee6afbf6f0730",
    FEED: "0x5d5530eb3147152fe78d5c4bfeede054c8d1442a",
    GRAIN: "0x02838746d9e1413e07ee064fcbada57055417f21",
    JEFE: "0x5b2af7fd27e2ea14945c82dd254c79d3ed34685e",
    DAI: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    BASED: "0x8d7d3409881b51466b483b11ea1b8a03cded89ae",
    BSHARE: '0x49C290Ff692149A4E16611c694fdED42C954ab7a'
  },
  heco: {
    BIFI: "0x765277eebeca2e31912c9946eae1021199b39c61",
  },
  polygon: {
    FEVR: "0xe6b9d092223f39013656702a40dbe6b7decc5746",
    BELUGA: "0x47536f17f4ff30e64a96a7555826b8f9e66ec468",
    BIFI: "0xfbdd194376de19a88118e84e279b977f165d01b8",
    MIMIR: "0xd1790c5435b9fb7c9444c749cefe53d40d751eac",
    FEED: "0x7c10b66c442fc403ab2b8bd73553d0df262ad8a5",
    BANANA: "0x5d47baba0d66083c52009271faf3f50dcc01023c",
    DHV: "0x5fcb9de282af6122ce3518cde28b7089c9f97b26",
    multiBTC: "0xf5b9b4a0534cf508ab9953c64c5310dfa0b303a1",
    MIM: "0x49a0400587a7f65072c87c4910449fdcc5c47242",
    JUSD: "0x0ba8a6ce46d369d779299dedade864318097b703",
  },
  moonriver: {
    MIM: "0x0cae51e1032e8461f4806e26332c030e34de3adb",
    BIFI: "0x173fd7434b8b50df08e3298f173487ebdb35fd14",
  },
  celo: {
    BIFI: "0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c",
  },
  fuse: {
    agEUR: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
  },
  boba: {
    MIM: "0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0",
  },
  optimism: {
    MIM: "0xb153fb3d196a8eb25522705560ac152eeec57901",
    GRAIN: "0xfd389dc9533717239856190f42475d3f263a270d",
  },
  era: {
    MVX: "0xc8ac6191cdc9c7bf846ad6b52aaaa7a0757ee305",
  },
  metis: {
    BIOS: "0x3405a1bd46b85c5c029483fbecf2f3e611026e45",
    BIFI: "0xe6801928061cdbe32ac5ad0634427e140efd05f9",
  },
  kava: {
    BUSD: "0x332730a4f6e03d9c55829435f10360e13cfa41ff",
    SUSHI: "0x7c598c96d02398d89fbcb9d41eab3df0c16f227d",
    DAI: "0x765277eebeca2e31912c9946eae1021199b39c61",
    ETH: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    USDC: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
    USDT: "0xb44a9b6905af7c801311e8f4e76932ee959c663c",
    WBTC: "0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b",
    null:"0xa0eeda2e3075092d66384fe8c91a1da4bca21788"
  },
  kardia: {
    USDC: "0x765277eebeca2e31912c9946eae1021199b39c61",
  },
  step: {
    BNB: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
    USDC: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    USDT: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
    ETH: "0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b",
  },
  godwoken_v1: {
    DAI: "0x765277eebeca2e31912c9946eae1021199b39c61",
    WBTC: "0xb44a9b6905af7c801311e8f4e76932ee959c663c",
    USDC: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    USDT: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
  },
  ethpow: {
    DAI: "0x312b15d6d531ea0fe91ddd212db8c0f37e4cc698",
    USDC: "0x11bbb41b3e8baf7f75773db7428d5acee25fec75",
    USDT: "0x8a496486f4c7cb840555bc2be327cba1447027c3",
    WBTC: "0x5df101f56ea643e06066392d266e9f4366b9186d",
    ETH: "0xaf3ccfd9b59b36628cc2f659a09d6440795b2520",
  },
  milkomeda_a1: {
    BUSD: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
    USDC: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    USDT: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
  },
  wemix: {
    BNB: "0xc1be9a4d5d45beeacae296a7bd5fadbfc14602c4",
    KLAY: "0x461d52769884ca6235b685ef2040f47d30c94eb5",
    USDC: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
    USDT: "0xa649325aa7c5093d12d6f98eb4378deae68ce23f",
    WBTC: "0x2c78f1b70ccf63cdee49f9233e9faa99d43aa07e",
    ETH: "0x765277eebeca2e31912c9946eae1021199b39c61",
  },
  eos_evm: {
    USDC: "0x765277eebeca2e31912c9946eae1021199b39c61",
    USDT: "0xfa9343c3897324496a05fc75abed6bac29f8a40f",
    WBTC: "0xefaeee334f0fd1712f9a8cc375f427d9cdd40d73",
    ETH: "0x922d641a426dcffaef11680e5358f34d97d112e1",
  },
  coingecko: {
    PREMIO: "premio",
    TFBX: "truefeedbackchain",
  },
  bittorrent: {
    WBTT: '0x8d193c6efa90bcff940a98785d1ce9d093d3dc8a'
  },
};
const eulerTokens = [
  "0x1b808f49add4b8c6b5117d9681cf7312fcf0dc1d",
  "0xe025e3ca2be02316033184551d4d3aa22024d9dc",
  "0xeb91861f8a4e1c12333f42dce8fb0ecdc28da716",
  "0x4d19f33948b99800b6113ff3e83bec9b537c85d2",
  "0x5484451a88a35cd0878a1be177435ca8a0e4054e",
  // 4626 wrapped eTokens
  "0x60897720aa966452e8706e74296b018990aec527",
  "0x3c66B18F67CA6C1A71F829E2F6a0c987f97462d0",
  "0x4169Df1B7820702f566cc10938DA51F6F597d264",
  "0xbd1bd5c956684f7eb79da40f582cbe1373a1d593",
];

export default async function getTokenPrices(chain: string, timestamp: number) {
  const block: number | undefined = await getBlock(chain, timestamp);
  const writes: Write[] = [];

  if (chain == "coingecko") {
    const symbols = Object.keys(contracts[chain]);
    symbols.map((s: string) => {
      writes.push(
        {
          PK: `coingecko#${contracts[chain][s]}`,
          SK: 0,
          confidence: 1.01,
          price: 0,
          symbol: s,
          adapter: "distressed",
          timestamp: timestamp == 0 ? getCurrentUnixTimestamp() : timestamp,
        },
        {
          PK: `coingecko#${contracts[chain][s]}`,
          SK: timestamp,
          confidence: 1.01,
          price: 0,
          adapter: "distressed",
        },
      );
    });
  } else {
    const tokens = Object.values(contracts[chain]);
    if (chain === "ethereum") tokens.push(...eulerTokens);
    const tokenInfos = await getTokenInfo(chain, tokens, block);
    tokens.map((a: string, i: number) => {
      addToDBWritesList(
        writes,
        chain,
        a,
        0,
        tokenInfos.decimals[i].output,
        tokenInfos.symbols[i].output,
        timestamp,
        "distressed",
        1.01,
      );
    });
  }

  return writes;
}