const InputForm = ({ name, label, register, errors, type = 'text', multiple }) => {
    return (
        <div className="form-group">
            <label className="mb-1 block text-sm font-medium uppercase tracking-wide text-blue-300">{label}:</label>
            <input
                required
                multiple={multiple}
                type={type}
                id={name}
                {...register(name)}
                className={`w-full mb-2 transform rounded-md border px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 focus:scale-105 focus:outline-none ${errors ? 'border-red-500 focus:border-red-500' : 'border-gray-600 bg-gray-700 focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50'
                    }`}
            />
            {errors && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>
    );
}

export default InputForm;
