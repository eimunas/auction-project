import { v4 as uuid } from 'uuid';
import bcrypt from 'bcryptjs';

export const ADMIN_EMAIL = 'admin@example.com';
export const ADMIN_PASSWORD = 'adminpassword';
export const USER_EMAIL = 'user@example.com';
export const USER_PASSWORD = 'userpassword';

export const userList = [
    {
        id: uuid(),
        name: "Admin",
        email: ADMIN_EMAIL,
        password: bcrypt.hashSync(ADMIN_PASSWORD, 10),
        wins: [
            {
                winId: uuid(),
                legoName: "Lego Star Wars Winner Edition 1",
                legoPrice: 55.00
            },
            {
                winId: uuid(),
                legoName: "Lego Star Wars Winner Edition 2",
                legoPrice: 120.00
            }
        ],
        isAdmin: true
    },
    {
        id: uuid(),
        name: "User",
        email: USER_EMAIL,
        password: bcrypt.hashSync(USER_PASSWORD, 10),
        wins: [],
        isAdmin: false
    },
    {
        id: "test-id",
        name: "Test",
        email: "test@example.com",
        password: bcrypt.hashSync("testpassword", 10),
        wins: [],
        isAdmin: false
    }
];

export const legoList = [
    {
        id: "testing-id-for-lego",
        bids: [
            {
                bidID: uuid(),
                legoID: uuid(),
                userID: userList[0].id,
                amount: 45.00
            },
            {
                bidID: uuid(),
                legoID: uuid(),
                userID: userList[0].id,
                amount: 50.00
            }
        ],
        name: "Jedi Bob's Starfighter",
        price: 39.99,
        deadline: '2024-10-09',
        interestTheme: 'fantasy',
        url: 'https://www.lego.com/cdn/cs/set/assets/bltb1303e8595a97611/75388_Prod.png?format=webply&fit=bounds&quality=80&width=600&height=600&dpr=2'
    },
    {
        id: "testing-id-for-lego-online",
        bids: [],
        name: "LEGO® Star Wars™ De Onyx Cinder",
        price: 159.99,
        deadline: '2024-12-09',
        interestTheme: 'fantasy',
        url: 'https://www.lego.com/cdn/cs/set/assets/blt23c539c32bf51a90/75374_Prod.png?format=webply&fit=bounds&quality=80&width=600&height=600&dpr=2'
    },
    {
        id: uuid(),
        bids: [],
        name: "NINJAGO® City Markets",
        price: 369.99,
        deadline: '2024-12-09',
        interestTheme: 'ninja',
        url: 'https://www.lego.com/cdn/cs/set/assets/blt17452f7f0b4a4d08/71799.png?format=webply&fit=bounds&quality=80&width=600&height=600&dpr=2'
    },
    {
        id: uuid(),
        bids: [],
        name: "Batman™: Batmobile™ Tumbler",
        price: 145.99,
        deadline: '2024-10-04',
        interestTheme: 'fantasy',
        url: 'https://www.lego.com/cdn/cs/set/assets/blt755a6d05eac6630d/76240.png?format=webply&fit=bounds&quality=80&width=600&height=600&dpr=2'
    },
    {
        id: uuid(),
        bids: [],
        name: "THE LORD OF THE RINGS: RIVENDELL™",
        price: 499.99,
        deadline: '2024-12-09',
        interestTheme: 'medieval',
        url: 'https://www.lego.com/cdn/cs/set/assets/bltec012c948c003fba/10316_alt16.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
    },
    {
        id: uuid(),
        bids: [],
        name: "NINJAGO Tournament battle arena™",
        price: 14.99,
        deadline: '2024-11-09',
        interestTheme: 'ninja',
        url: 'https://www.lego.com/cdn/cs/set/assets/bltd18a570fe6371cba/71818.png?format=webply&fit=bounds&quality=80&width=600&height=600&dpr=2'
    },
    {
        id: "testing-id-for-lego2",
        bids: [],
        name: "INDIANA JONES™ Escape from the hidden tomb",
        price: 12.99,
        deadline: '2024-12-11',
        interestTheme: 'adventure',
        url: 'https://www.lego.com/cdn/cs/set/assets/blt9227e19b1ba8cb52/77013.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
    },
    {
        id: uuid(),
        bids: [],
        name: "INDIANA JONES™ Fighter aircraft pursuit",
        price: 34.99,
        deadline: '2024-12-28',
        interestTheme: 'adventure',
        url: 'https://www.lego.com/cdn/cs/set/assets/bltb2875fccb8417e8f/77012.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
    },
    {
        id: uuid(),
        bids: [],
        name: "LEGO AVATAR: Ski mowing adventure™",
        price: 25.99,
        deadline: '2024-10-31',
        interestTheme: 'fantasy',
        url: 'https://www.lego.com/cdn/cs/set/assets/blt2b0805b2a55ae1a2/75576.png?format=webply&fit=bounds&quality=60&width=800&height=800&dpr=2'
    }
];


