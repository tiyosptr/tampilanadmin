"use client";
import FirebaseConfig from "../FirebaseConfig/FirebaseConfig";
import { ref, set, get, update, remove, child, onValue } from "firebase/database";
import { useState, useEffect } from "react";

const database = FirebaseConfig();

function FirebaseCrud() {
    const [username, setUsername] = useState('');x
    const [fullname, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [dob, setDob] = useState('');
    const [customers, setCustomers] = useState([]);
    
    useEffect(() => {
        const dbref = ref(database, 'Customer');
        onValue(dbref, (snapshot) => {
            const customersData = [];
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                customersData.push({
                    id: childSnapshot.key,
                    ...data
                });
            });
            setCustomers(customersData);
        });
    }, []);

    let isNullOrWhiteSpaces = (value) => {
        value = value.toString();
        return value == null || value.replaceAll('', '').length < 1;
    }

    let InsertData = () => {
        const dbref = ref(database, 'Customer');
        if (
            isNullOrWhiteSpaces(username) ||
            isNullOrWhiteSpaces(fullname) ||
            isNullOrWhiteSpaces(phone) ||
            isNullOrWhiteSpaces(dob)
        ) {
            alert("Harap isi");
            return;
        }

        get(child(dbref, username)).then((snapshot) => {
            if (snapshot.exists()) {
                alert("the user already exists, try a different one");
            } else {
                set(ref(database, 'Customer/' + username), {
                    fullname: fullname,
                    numberphone: phone,
                    dateofbirth: dob
                }).then(() => {
                    alert("Customer update success");
                }).catch((error) => {
                    console.log(error);
                    alert("there was an error updating");
                });
            }
        }).catch((error) => {
            console.log(error);
            alert("error data tidak sukses");
        });
    }

    let UpdateData = () => {
        const dbref = ref(database, 'Customer');
        if (isNullOrWhiteSpaces(username)) {
            alert("Harap isi username");
            return;
        }

        get(child(dbref, username)).then((snapshot) => {
            if (snapshot.exists()) {
                update(ref(database, 'Customer/' + username), {
                    fullname: fullname,
                    numberphone: phone,
                    dateofbirth: dob
                }).then(() => {
                    alert("Customer update success");
                }).catch((error) => {
                    console.log(error);
                    alert("there was an error updating");
                });
            } else {
                alert('error: the user does not exist');
            }
        }).catch((error) => {
            console.log(error);
            alert("error data tidak sukses");
        });
    }

    let DeleteData = () => {
        const dbref = ref(database, 'Customer');
        if (isNullOrWhiteSpaces(username)) {
            alert("Harap isi username");
            return;
        }

        get(child(dbref, username)).then((snapshot) => {
            if (snapshot.exists()) {
                remove(ref(database, 'Customer/' + username))
                    .then(() => {
                        alert("Customer Delete success");
                    })
                    .catch((error) => {
                        console.log(error);
                        alert("there was an error deleting");
                    });
            } else {
                alert('error: the user does not exist');
            }
        }).catch((error) => {
            console.log(error);
            alert("error data tidak sukses");
        });
    }

    let SelectData = (customer) => {
        setUsername(customer.id);
        setFullName(customer.fullname);
        setPhone(customer.numberphone);
        setDob(customer.dateofbirth);
    }

    return (
        <>
            <label>Username</label>
            <input className="border border-black-50" type="text" value={username} onChange={e => setUsername(e.target.value)} />
            <br />
            <label>FullName</label>
            <input className="border border-black-50" type="text" value={fullname} onChange={e => setFullName(e.target.value)} />
            <br />
            <label>Number Phone</label>
            <input className="border border-black-50" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
            <br />
            <label>Date Of Birth</label>
            <input className="border border-black-50" type="date" value={dob} onChange={e => setDob(e.target.value)} />
            <br />
            <button onClick={InsertData} className="border border-black-50">Insert Data</button>
            <button onClick={UpdateData} className="border border-black-50">Update Data</button>
            <button onClick={DeleteData} className="border border-black-50">Delete Data</button>
            <br />
            <br />
            <table className="border-collapse border border-black-500">
                <thead>
                    <tr>
                        <th className="border border-black-500">Username</th>
                        <th className="border border-black-500">Full Name</th>
                        <th className="border border-black-500">Phone</th>
                        <th className="border border-black-500">Date of Birth</th>
                        <th className="border border-black-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.map((customer) => (
                        <tr key={customer.id}>
                            <td className="border border-black-500">{customer.id}</td>
                            <td className="border border-black-500">{customer.fullname}</td>
                            <td className="border border-black-500">{customer.numberphone}</td>
                            <td className="border border-black-500">{customer.dateofbirth}</td>
                            <td className="border border-black-500">
                                <button onClick={() => SelectData(customer)}>Select</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

export default FirebaseCrud;
