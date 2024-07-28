// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistry {
    struct User {
        string email;
        string passwordHash; // In practice, use more secure methods for handling passwords
    }

    mapping(address => User) private users;
    mapping(string => bool) private emailExists;

    event UserRegistered(address indexed userAddress, string email);

    /**
     * @dev Register a new user with email and password hash.
     * @param _email The email of the user.
     * @param _passwordHash The hashed password of the user.
     */
    function registerUser(string memory _email, string memory _passwordHash) public {
        require(!emailExists[_email], "Email already registered");
        require(bytes(users[msg.sender].email).length == 0, "User already registered");

        users[msg.sender] = User(_email, _passwordHash);
        emailExists[_email] = true;

        emit UserRegistered(msg.sender, _email);
    }

    /**
     * @dev Check if an email is already registered.
     * @param _email The email to check.
     * @return bool True if the email is registered, otherwise false.
     */
    function isEmailRegistered(string memory _email) public view returns (bool) {
        return emailExists[_email];
    }

    /**
     * @dev Get the user's email and password hash by address.
     * @param _userAddress The address of the user.
     * @return email The email of the user.
     * @return passwordHash The hashed password of the user.
     */
    function getUser(address _userAddress) public view returns (string memory email, string memory passwordHash) {
        User memory user = users[_userAddress];
        return (user.email, user.passwordHash);
    }
}
