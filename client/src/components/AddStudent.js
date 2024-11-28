import React, {useState} from 'react'



const AddStudent = () => {

    const [student, setStudent] = useState("");

        const add = async e => {
            try {
                const body = {student}
                const response = await fetch("http://localhost:8000/student",
                    {
                        method : "POST",
                        headers: {"Content-Type" : "application/json"},
                        body: JSON.stringify(body)
                    }
                );
                console.log(response);
            }
            catch (err) {
                console.error(err.message);
            }
        }
    
    return (

        <div>
            <h1>add Students</h1>
            <form>
                <input type="text" placeholder="add"/>

                
            </form>
        </div>

        
    )
}

export default AddStudent