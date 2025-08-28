---
sidebar_position: 5
---

# Cloud Security and Compliance

Master comprehensive security practices across cloud platforms, implementing advanced identity management, data protection, network security, and compliance frameworks.

## Learning Objectives

By the end of this module, you will:
- Implement advanced identity and access management across multi-cloud environments
- Design comprehensive data protection and encryption strategies
- Master network security and threat detection across cloud platforms
- Ensure compliance with industry regulations and security frameworks
- Build automated security monitoring and incident response capabilities

## 1. Advanced Identity and Access Management

### Zero Trust Architecture Implementation

**Multi-Cloud Zero Trust Framework:**
```python
# Zero Trust security model implementation
import json
import hashlib
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import jwt
from cryptography.fernet import Fernet

class ZeroTrustSecurityFramework:
    def __init__(self):
        self.trust_levels = {
            'no_trust': 0,
            'minimal_trust': 25,
            'limited_trust': 50,
            'moderate_trust': 75,
            'high_trust': 90,
            'full_trust': 100
        }
        
        self.risk_factors = {
            'device_compliance': {'weight': 20, 'max_score': 100},
            'location_risk': {'weight': 15, 'max_score': 100},
            'behavior_analysis': {'weight': 25, 'max_score': 100},
            'network_security': {'weight': 20, 'max_score': 100},
            'time_based_risk': {'weight': 10, 'max_score': 100},
            'authentication_strength': {'weight': 10, 'max_score': 100}
        }
        
        self.encryption_key = Fernet.generate_key()
        self.cipher_suite = Fernet(self.encryption_key)
    
    def calculate_trust_score(self, user_context: Dict) -> Dict:
        """Calculate dynamic trust score based on multiple factors"""
        total_score = 0
        factor_scores = {}
        
        # Device compliance score
        device_score = self._evaluate_device_compliance(user_context.get('device', {}))
        factor_scores['device_compliance'] = device_score
        total_score += (device_score * self.risk_factors['device_compliance']['weight']) / 100
        
        # Location risk score
        location_score = self._evaluate_location_risk(user_context.get('location', {}))
        factor_scores['location_risk'] = location_score
        total_score += (location_score * self.risk_factors['location_risk']['weight']) / 100
        
        # Behavior analysis score
        behavior_score = self._evaluate_behavior_pattern(user_context.get('behavior', {}))
        factor_scores['behavior_analysis'] = behavior_score
        total_score += (behavior_score * self.risk_factors['behavior_analysis']['weight']) / 100
        
        # Network security score
        network_score = self._evaluate_network_security(user_context.get('network', {}))
        factor_scores['network_security'] = network_score
        total_score += (network_score * self.risk_factors['network_security']['weight']) / 100
        
        # Time-based risk score
        time_score = self._evaluate_time_based_risk(user_context.get('timestamp', time.time()))
        factor_scores['time_based_risk'] = time_score
        total_score += (time_score * self.risk_factors['time_based_risk']['weight']) / 100
        
        # Authentication strength score
        auth_score = self._evaluate_authentication_strength(user_context.get('authentication', {}))
        factor_scores['authentication_strength'] = auth_score
        total_score += (auth_score * self.risk_factors['authentication_strength']['weight']) / 100
        
        return {
            'total_score': min(100, max(0, total_score)),
            'trust_level': self._get_trust_level(total_score),
            'factor_scores': factor_scores,
            'recommendations': self._generate_recommendations(factor_scores)
        }
    
    def _evaluate_device_compliance(self, device_info: Dict) -> int:
        """Evaluate device compliance score"""
        score = 100
        
        # Check if device is managed
        if not device_info.get('managed', False):
            score -= 30
        
        # Check OS version
        if device_info.get('os_outdated', False):
            score -= 20
        
        # Check for security software
        if not device_info.get('antivirus_enabled', False):
            score -= 15
        
        # Check encryption status
        if not device_info.get('disk_encrypted', False):
            score -= 25
        
        # Check for jailbreak/root
        if device_info.get('compromised', False):
            score -= 50
        
        return max(0, score)
    
    def _evaluate_location_risk(self, location_info: Dict) -> int:
        """Evaluate location-based risk score"""
        score = 100
        
        # Check if location is in high-risk country
        high_risk_countries = ['CN', 'RU', 'IR', 'KP']  # Example list
        if location_info.get('country_code') in high_risk_countries:
            score -= 40
        
        # Check for VPN/Proxy usage
        if location_info.get('using_vpn', False):
            score -= 20
        
        # Check location consistency
        if location_info.get('location_jump', False):
            score -= 30
        
        # Check for known malicious IPs
        if location_info.get('malicious_ip', False):
            score -= 50
        
        return max(0, score)
    
    def _evaluate_behavior_pattern(self, behavior_info: Dict) -> int:
        """Evaluate user behavior pattern score"""
        score = 100
        
        # Check login time patterns
        if behavior_info.get('unusual_time', False):
            score -= 15
        
        # Check access patterns
        if behavior_info.get('unusual_resources', False):
            score -= 20
        
        # Check failed login attempts
        failed_attempts = behavior_info.get('failed_logins', 0)
        if failed_attempts > 3:
            score -= min(30, failed_attempts * 5)
        
        # Check data access patterns
        if behavior_info.get('unusual_data_access', False):
            score -= 25
        
        return max(0, score)
    
    def _evaluate_network_security(self, network_info: Dict) -> int:
        """Evaluate network security score"""
        score = 100
        
        # Check network type
        network_type = network_info.get('type', 'unknown')
        if network_type == 'public':
            score -= 30
        elif network_type == 'unknown':
            score -= 20
        
        # Check for secure connection
        if not network_info.get('encrypted_connection', False):
            score -= 25
        
        # Check for known malicious networks
        if network_info.get('malicious_network', False):
            score -= 50
        
        return max(0, score)
    
    def _evaluate_time_based_risk(self, timestamp: float) -> int:
        """Evaluate time-based risk factors"""
        score = 100
        current_time = datetime.fromtimestamp(timestamp)
        
        # Check if access is during business hours
        if current_time.hour < 6 or current_time.hour > 22:
            score -= 15
        
        # Check if access is during weekend
        if current_time.weekday() >= 5:  # Saturday = 5, Sunday = 6
            score -= 10
        
        return max(0, score)
    
    def _evaluate_authentication_strength(self, auth_info: Dict) -> int:
        """Evaluate authentication strength"""
        score = 50  # Base score for single factor
        
        # Multi-factor authentication
        if auth_info.get('mfa_enabled', False):
            score += 30
        
        # Biometric authentication
        if auth_info.get('biometric_used', False):
            score += 15
        
        # Hardware token
        if auth_info.get('hardware_token', False):
            score += 20
        
        # Password strength
        password_strength = auth_info.get('password_strength', 'weak')
        if password_strength == 'strong':
            score += 10
        elif password_strength == 'medium':
            score += 5
        
        return min(100, score)
    
    def _get_trust_level(self, score: float) -> str:
        """Convert numeric score to trust level"""
        if score >= 90:
            return 'high_trust'
        elif score >= 75:
            return 'moderate_trust'
        elif score >= 50:
            return 'limited_trust'
        elif score >= 25:
            return 'minimal_trust'
        else:
            return 'no_trust'
    
    def _generate_recommendations(self, factor_scores: Dict) -> List[str]:
        """Generate security recommendations based on scores"""
        recommendations = []
        
        if factor_scores['device_compliance'] < 70:
            recommendations.append("Ensure device is managed and compliant with security policies")
        
        if factor_scores['location_risk'] < 70:
            recommendations.append("Verify user location and consider additional authentication")
        
        if factor_scores['behavior_analysis'] < 70:
            recommendations.append("Review user behavior patterns for anomalies")
        
        if factor_scores['network_security'] < 70:
            recommendations.append("Use secure network connections and avoid public WiFi")
        
        if factor_scores['authentication_strength'] < 80:
            recommendations.append("Enable multi-factor authentication and use strong passwords")
        
        return recommendations
    
    def generate_access_token(self, user_id: str, trust_score: Dict, permissions: List[str]) -> str:
        """Generate JWT access token with trust-based permissions"""
        # Adjust permissions based on trust level
        adjusted_permissions = self._adjust_permissions_by_trust(permissions, trust_score['trust_level'])
        
        # Calculate token expiration based on trust level
        expiration_minutes = self._calculate_token_expiration(trust_score['trust_level'])
        
        payload = {
            'user_id': user_id,
            'permissions': adjusted_permissions,
            'trust_score': trust_score['total_score'],
            'trust_level': trust_score['trust_level'],
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(minutes=expiration_minutes),
            'jti': hashlib.sha256(f"{user_id}{time.time()}".encode()).hexdigest()[:16]
        }
        
        # Sign token (in production, use proper secret management)
        token = jwt.encode(payload, 'your-secret-key', algorithm='HS256')
        return token
    
    def _adjust_permissions_by_trust(self, permissions: List[str], trust_level: str) -> List[str]:
        """Adjust permissions based on trust level"""
        high_risk_permissions = ['admin', 'delete', 'modify_security', 'export_data']
        
        if trust_level in ['no_trust', 'minimal_trust']:
            # Remove all high-risk permissions
            return [p for p in permissions if p not in high_risk_permissions]
        elif trust_level == 'limited_trust':
            # Remove admin and security modification permissions
            restricted = ['admin', 'modify_security']
            return [p for p in permissions if p not in restricted]
        elif trust_level == 'moderate_trust':
            # Remove only admin permissions
            return [p for p in permissions if p != 'admin']
        else:
            # High trust - allow all permissions
            return permissions
    
    def _calculate_token_expiration(self, trust_level: str) -> int:
        """Calculate token expiration based on trust level"""
        expiration_map = {
            'no_trust': 5,        # 5 minutes
            'minimal_trust': 15,  # 15 minutes
            'limited_trust': 60,  # 1 hour
            'moderate_trust': 240, # 4 hours
            'high_trust': 480     # 8 hours
        }
        return expiration_map.get(trust_level, 15)

# Usage example
zero_trust = ZeroTrustSecurityFramework()

# Example user context
user_context = {
    'device': {
        'managed': True,
        'os_outdated': False,
        'antivirus_enabled': True,
        'disk_encrypted': True,
        'compromised': False
    },
    'location': {
        'country_code': 'US',
        'using_vpn': False,
        'location_jump': False,
        'malicious_ip': False
    },
    'behavior': {
        'unusual_time': False,
        'unusual_resources': False,
        'failed_logins': 1,
        'unusual_data_access': False
    },
    'network': {
        'type': 'corporate',
        'encrypted_connection': True,
        'malicious_network': False
    },
    'timestamp': time.time(),
    'authentication': {
        'mfa_enabled': True,
        'biometric_used': False,
        'hardware_token': True,
        'password_strength': 'strong'
    }
}

# Calculate trust score
trust_result = zero_trust.calculate_trust_score(user_context)
print("Zero Trust Assessment Results:")
print(f"Trust Score: {trust_result['total_score']:.1f}")
print(f"Trust Level: {trust_result['trust_level']}")
print(f"Recommendations: {trust_result['recommendations']}")

# Generate access token
permissions = ['read', 'write', 'delete', 'admin']
token = zero_trust.generate_access_token('user123', trust_result, permissions)
print(f"\nGenerated Access Token: {token[:50]}...")
```

### Free Resources

- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Comprehensive security framework
- [Zero Trust Architecture - NIST](https://csrc.nist.gov/publications/detail/sp/800-207/final) - Zero trust implementation guide
- [AWS Security Best Practices](https://aws.amazon.com/architecture/security-identity-compliance/) - AWS security guidance
- [Azure Security Documentation](https://docs.microsoft.com/en-us/azure/security/) - Azure security best practices

## 2. Data Protection and Encryption

### Multi-Cloud Encryption Strategies

**Advanced Encryption Implementation:**
```python
# Multi-cloud encryption and key management
import os
import json
import base64
import hashlib
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from typing import Dict, List, Optional, Tuple
import boto3
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
from google.cloud import kms

class MultiCloudEncryptionManager:
    def __init__(self):
        self.encryption_algorithms = {
            'symmetric': {
                'AES-256-GCM': 'Advanced Encryption Standard with Galois/Counter Mode',
                'ChaCha20-Poly1305': 'ChaCha20 stream cipher with Poly1305 authenticator',
                'Fernet': 'Symmetric encryption using AES 128 in CBC mode'
            },
            'asymmetric': {
                'RSA-4096': 'RSA with 4096-bit key size',
                'ECC-P384': 'Elliptic Curve Cryptography with P-384 curve',
                'Ed25519': 'EdDSA signature scheme using Curve25519'
            },
            'hashing': {
                'SHA-256': 'Secure Hash Algorithm 256-bit',
                'SHA-3-256': 'SHA-3 with 256-bit output',
                'BLAKE2b': 'BLAKE2 cryptographic hash function'
            }
        }
        
        self.cloud_kms_services = {
            'aws': 'AWS Key Management Service (KMS)',
            'azure': 'Azure Key Vault',
            'gcp': 'Google Cloud Key Management Service'
        }
    
    def generate_encryption_key(self, algorithm: str = 'fernet') -> bytes:
        """Generate encryption key for specified algorithm"""
        if algorithm.lower() == 'fernet':
            return Fernet.generate_key()
        elif algorithm.lower() == 'aes':
            return os.urandom(32)  # 256-bit key
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    def encrypt_data(self, data: str, key: bytes, algorithm: str = 'fernet') -> str:
        """Encrypt data using specified algorithm"""
        if algorithm.lower() == 'fernet':
            cipher_suite = Fernet(key)
            encrypted_data = cipher_suite.encrypt(data.encode())
            return base64.b64encode(encrypted_data).decode()
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    def decrypt_data(self, encrypted_data: str, key: bytes, algorithm: str = 'fernet') -> str:
        """Decrypt data using specified algorithm"""
        if algorithm.lower() == 'fernet':
            cipher_suite = Fernet(key)
            encrypted_bytes = base64.b64decode(encrypted_data.encode())
            decrypted_data = cipher_suite.decrypt(encrypted_bytes)
            return decrypted_data.decode()
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    def generate_rsa_keypair(self, key_size: int = 4096) -> Tuple[bytes, bytes]:
        """Generate RSA public/private key pair"""
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=key_size
        )
        
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        public_key = private_key.public_key()
        public_pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return private_pem, public_pem
    
    def encrypt_with_rsa(self, data: str, public_key_pem: bytes) -> str:
        """Encrypt data using RSA public key"""
        public_key = serialization.load_pem_public_key(public_key_pem)
        
        encrypted_data = public_key.encrypt(
            data.encode(),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return base64.b64encode(encrypted_data).decode()
    
    def decrypt_with_rsa(self, encrypted_data: str, private_key_pem: bytes) -> str:
        """Decrypt data using RSA private key"""
        private_key = serialization.load_pem_private_key(private_key_pem, password=None)
        
        encrypted_bytes = base64.b64decode(encrypted_data.encode())
        decrypted_data = private_key.decrypt(
            encrypted_bytes,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        
        return decrypted_data.decode()
    
    def derive_key_from_password(self, password: str, salt: bytes = None) -> Tuple[bytes, bytes]:
        """Derive encryption key from password using PBKDF2"""
        if salt is None:
            salt = os.urandom(16)
        
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        
        key = kdf.derive(password.encode())
        return key, salt
    
    def hash_data(self, data: str, algorithm: str = 'sha256') -> str:
        """Hash data using specified algorithm"""
        if algorithm.lower() == 'sha256':
            hash_object = hashlib.sha256(data.encode())
            return hash_object.hexdigest()
        elif algorithm.lower() == 'sha3-256':
            hash_object = hashlib.sha3_256(data.encode())
            return hash_object.hexdigest()
        else:
            raise ValueError(f"Unsupported hashing algorithm: {algorithm}")

class AWSKeyManagement:
    def __init__(self, region_name: str = 'us-west-2'):
        self.kms_client = boto3.client('kms', region_name=region_name)
        self.region_name = region_name
    
    def create_customer_managed_key(self, description: str, key_usage: str = 'ENCRYPT_DECRYPT') -> str:
        """Create a customer-managed KMS key"""
        try:
            response = self.kms_client.create_key(
                Description=description,
                KeyUsage=key_usage,
                KeySpec='SYMMETRIC_DEFAULT',
                Origin='AWS_KMS',
                MultiRegion=False,
                Tags=[
                    {'TagKey': 'Purpose', 'TagValue': 'DataEncryption'},
                    {'TagKey': 'Environment', 'TagValue': 'Production'}
                ]
            )
            return response['KeyMetadata']['KeyId']
        except Exception as e:
            print(f"Error creating KMS key: {str(e)}")
            return None
    
    def encrypt_with_kms(self, plaintext: str, key_id: str, encryption_context: Dict = None) -> str:
        """Encrypt data using AWS KMS"""
        try:
            response = self.kms_client.encrypt(
                KeyId=key_id,
                Plaintext=plaintext.encode(),
                EncryptionContext=encryption_context or {}
            )
            return base64.b64encode(response['CiphertextBlob']).decode()
        except Exception as e:
            print(f"Error encrypting with KMS: {str(e)}")
            return None
    
    def decrypt_with_kms(self, ciphertext: str, encryption_context: Dict = None) -> str:
        """Decrypt data using AWS KMS"""
        try:
            ciphertext_blob = base64.b64decode(ciphertext.encode())
            response = self.kms_client.decrypt(
                CiphertextBlob=ciphertext_blob,
                EncryptionContext=encryption_context or {}
            )
            return response['Plaintext'].decode()
        except Exception as e:
            print(f"Error decrypting with KMS: {str(e)}")
            return None
    
    def generate_data_key(self, key_id: str, key_spec: str = 'AES_256') -> Tuple[str, str]:
        """Generate a data encryption key"""
        try:
            response = self.kms_client.generate_data_key(
                KeyId=key_id,
                KeySpec=key_spec
            )
            
            plaintext_key = base64.b64encode(response['Plaintext']).decode()
            encrypted_key = base64.b64encode(response['CiphertextBlob']).decode()
            
            return plaintext_key, encrypted_key
        except Exception as e:
            print(f"Error generating data key: {str(e)}")
            return None, None

class AzureKeyVaultManager:
    def __init__(self, vault_url: str):
        self.credential = DefaultAzureCredential()
        self.client = SecretClient(vault_url=vault_url, credential=self.credential)
        self.vault_url = vault_url
    
    def store_secret(self, secret_name: str, secret_value: str, tags: Dict = None) -> bool:
        """Store a secret in Azure Key Vault"""
        try:
            self.client.set_secret(
                name=secret_name,
                value=secret_value,
                tags=tags or {}
            )
            return True
        except Exception as e:
            print(f"Error storing secret: {str(e)}")
            return False
    
    def retrieve_secret(self, secret_name: str) -> Optional[str]:
        """Retrieve a secret from Azure Key Vault"""
        try:
            secret = self.client.get_secret(secret_name)
            return secret.value
        except Exception as e:
            print(f"Error retrieving secret: {str(e)}")
            return None
    
    def list_secrets(self) -> List[str]:
        """List all secrets in the Key Vault"""
        try:
            secrets = self.client.list_properties_of_secrets()
            return [secret.name for secret in secrets]
        except Exception as e:
            print(f"Error listing secrets: {str(e)}")
            return []

class GCPKeyManagement:
    def __init__(self, project_id: str, location_id: str = 'global'):
        self.client = kms.KeyManagementServiceClient()
        self.project_id = project_id
        self.location_id = location_id
        self.location_name = f'projects/{project_id}/locations/{location_id}'
    
    def create_key_ring(self, key_ring_id: str) -> str:
        """Create a key ring in Google Cloud KMS"""
        try:
            key_ring = {
                'name': f'{self.location_name}/keyRings/{key_ring_id}'
            }
            
            operation = self.client.create_key_ring(
                request={
                    'parent': self.location_name,
                    'key_ring_id': key_ring_id,
                    'key_ring': key_ring
                }
            )
            
            return operation.name
        except Exception as e:
            print(f"Error creating key ring: {str(e)}")
            return None
    
    def create_crypto_key(self, key_ring_id: str, crypto_key_id: str) -> str:
        """Create a crypto key in Google Cloud KMS"""
        try:
            key_ring_name = f'{self.location_name}/keyRings/{key_ring_id}'
            
            purpose = kms.CryptoKey.CryptoKeyPurpose.ENCRYPT_DECRYPT
            crypto_key = {
                'purpose': purpose,
                'version_template': {
                    'algorithm': kms.CryptoKeyVersion.CryptoKeyVersionAlgorithm.GOOGLE_SYMMETRIC_ENCRYPTION,
                }
            }
            
            operation = self.client.create_crypto_key(
                request={
                    'parent': key_ring_name,
                    'crypto_key_id': crypto_key_id,
                    'crypto_key': crypto_key
                }
            )
            
            return operation.name
        except Exception as e:
            print(f"Error creating crypto key: {str(e)}")
            return None
    
    def encrypt_with_gcp_kms(self, key_ring_id: str, crypto_key_id: str, plaintext: str) -> str:
        """Encrypt data using Google Cloud KMS"""
        try:
            key_name = f'{self.location_name}/keyRings/{key_ring_id}/cryptoKeys/{crypto_key_id}'
            
            response = self.client.encrypt(
                request={
                    'name': key_name,
                    'plaintext': plaintext.encode()
                }
            )
            
            return base64.b64encode(response.ciphertext).decode()
        except Exception as e:
            print(f"Error encrypting with GCP KMS: {str(e)}")
            return None
    
    def decrypt_with_gcp_kms(self, key_ring_id: str, crypto_key_id: str, ciphertext: str) -> str:
        """Decrypt data using Google Cloud KMS"""
        try:
            key_name = f'{self.location_name}/keyRings/{key_ring_id}/cryptoKeys/{crypto_key_id}'
            ciphertext_bytes = base64.b64decode(ciphertext.encode())
            
            response = self.client.decrypt(
                request={
                    'name': key_name,
                    'ciphertext': ciphertext_bytes
                }
            )
            
            return response.plaintext.decode()
        except Exception as e:
            print(f"Error decrypting with GCP KMS: {str(e)}")
            return None

# Usage examples
encryption_manager = MultiCloudEncryptionManager()

# Generate and use Fernet key
fernet_key = encryption_manager.generate_encryption_key('fernet')
sensitive_data = "This is highly sensitive customer data"
encrypted_data = encryption_manager.encrypt_data(sensitive_data, fernet_key)
decrypted_data = encryption_manager.decrypt_data(encrypted_data, fernet_key)

print("Encryption Demo:")
print(f"Original: {sensitive_data}")
print(f"Encrypted: {encrypted_data[:50]}...")
print(f"Decrypted: {decrypted_data}")

# Generate RSA key pair
private_key, public_key = encryption_manager.generate_rsa_keypair()
rsa_encrypted = encryption_manager.encrypt_with_rsa(sensitive_data, public_key)
rsa_decrypted = encryption_manager.decrypt_with_rsa(rsa_encrypted, private_key)

print(f"\nRSA Encryption Demo:")
print(f"RSA Encrypted: {rsa_encrypted[:50]}...")
print(f"RSA Decrypted: {rsa_decrypted}")

# Password-based key derivation
password = "MySecurePassword123!"
derived_key, salt = encryption_manager.derive_key_from_password(password)
print(f"\nDerived Key: {base64.b64encode(derived_key).decode()}")
print(f"Salt: {base64.b64encode(salt).decode()}")
```

### Free Resources

- [AWS Encryption SDK](https://docs.aws.amazon.com/encryption-sdk/) - Client-side encryption library
- [Azure Encryption Overview](https://docs.microsoft.com/en-us/azure/security/fundamentals/encryption-overview) - Azure encryption services
- [Google Cloud Encryption](https://cloud.google.com/security/encryption-at-rest) - GCP encryption capabilities
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html) - Encryption best practices

## 3. Network Security and Threat Detection

### Advanced Network Security Implementation

**Multi-Cloud Network Security Framework:**
```python
# Advanced network security monitoring and threat detection
import json
import ipaddress
import re
from datetime import datetime, timedelta
from typing import Dict, List, Set, Optional, Tuple
from collections import defaultdict, deque
import hashlib

class NetworkSecurityMonitor:
    def __init__(self):
        self.threat_indicators = {
            'malicious_ips': set(),
            'suspicious_domains': set(),
            'known_attack_patterns': [],
            'geo_risk_countries': {'CN', 'RU', 'IR', 'KP', 'SY'},
            'tor_exit_nodes': set()
        }
        
        self.security_rules = {
            'max_failed_logins': 5,
            'max_requests_per_minute': 1000,
            'suspicious_user_agents': [
                'sqlmap', 'nmap', 'nikto', 'dirb', 'gobuster',
                'masscan', 'zap', 'burp'
            ],
            'blocked_file_extensions': [
                '.php', '.asp', '.jsp', '.cgi', '.pl'
            ]
        }
        
        self.traffic_log = deque(maxlen=10000)
        self.threat_log = deque(maxlen=1000)
        self.ip_reputation_cache = {}
        
    def analyze_network_traffic(self, traffic_data: Dict) -> Dict:
        """Analyze network traffic for security threats"""
        analysis_result = {
            'timestamp': datetime.now().isoformat(),
            'source_ip': traffic_data.get('source_ip'),
            'destination_ip': traffic_data.get('destination_ip'),
            'protocol': traffic_data.get('protocol'),
            'port': traffic_data.get('port'),
            'threat_level': 'low',
            'threats_detected': [],
            'recommendations': []
        }
        
        # Check for malicious IPs
        if self._is_malicious_ip(traffic_data.get('source_ip')):
            analysis_result['threats_detected'].append('malicious_source_ip')
            analysis_result['threat_level'] = 'high'
        
        # Check for suspicious ports
        if self._is_suspicious_port(traffic_data.get('port')):
            analysis_result['threats_detected'].append('suspicious_port')
            analysis_result['threat_level'] = max(analysis_result['threat_level'], 'medium')
        
        # Check for DDoS patterns
        if self._detect_ddos_pattern(traffic_data):
            analysis_result['threats_detected'].append('ddos_pattern')
            analysis_result['threat_level'] = 'critical'
        
        # Check for port scanning
        if self._detect_port_scan(traffic_data):
            analysis_result['threats_detected'].append('port_scan')
            analysis_result['threat_level'] = max(analysis_result['threat_level'], 'medium')
        
        # Check geographic risk
        if self._check_geographic_risk(traffic_data.get('source_ip')):
            analysis_result['threats_detected'].append('geographic_risk')
            analysis_result['threat_level'] = max(analysis_result['threat_level'], 'medium')
        
        # Generate recommendations
        analysis_result['recommendations'] = self._generate_security_recommendations(
            analysis_result['threats_detected']
        )
        
        # Log the traffic
        self.traffic_log.append(traffic_data)
        
        # Log threats if any detected
        if analysis_result['threats_detected']:
            self.threat_log.append(analysis_result)
        
        return analysis_result
    
    def _is_malicious_ip(self, ip_address: str) -> bool:
        """Check if IP address is known to be malicious"""
        if not ip_address:
            return False
        
        # Check against known malicious IPs
        if ip_address in self.threat_indicators['malicious_ips']:
            return True
        
        # Check if it's a Tor exit node
        if ip_address in self.threat_indicators['tor_exit_nodes']:
            return True
        
        # Check IP reputation (simplified)
        reputation = self._get_ip_reputation(ip_address)
        return reputation == 'malicious'
    
    def _is_suspicious_port(self, port: int) -> bool:
        """Check if port is commonly used for attacks"""
        if not port:
            return False
        
        # Common attack ports
        suspicious_ports = {
            23,    # Telnet
            135,   # RPC
            139,   # NetBIOS
            445,   # SMB
            1433,  # SQL Server
            1521,  # Oracle
            3389,  # RDP
            5432,  # PostgreSQL
            6379,  # Redis
            27017  # MongoDB
        }
        
        return port in suspicious_ports
    
    def _detect_ddos_pattern(self, traffic_data: Dict) -> bool:
        """Detect potential DDoS attack patterns"""
        source_ip = traffic_data.get('source_ip')
        if not source_ip:
            return False
        
        # Count requests from same IP in last minute
        current_time = datetime.now()
        one_minute_ago = current_time - timedelta(minutes=1)
        
        recent_requests = [
            log for log in self.traffic_log
            if log.get('source_ip') == source_ip and
            datetime.fromisoformat(log.get('timestamp', '1970-01-01')) > one_minute_ago
        ]
        
        return len(recent_requests) > self.security_rules['max_requests_per_minute']
    
    def _detect_port_scan(self, traffic_data: Dict) -> bool:
        """Detect port scanning activity"""
        source_ip = traffic_data.get('source_ip')
        if not source_ip:
            return False
        
        # Count unique ports accessed by same IP in last 5 minutes
        current_time = datetime.now()
        five_minutes_ago = current_time - timedelta(minutes=5)
        
        recent_ports = set()
        for log in self.traffic_log:
            if (log.get('source_ip') == source_ip and
                datetime.fromisoformat(log.get('timestamp', '1970-01-01')) > five_minutes_ago):
                recent_ports.add(log.get('port'))
        
        # If more than 10 different ports accessed, likely port scan
        return len(recent_ports) > 10
    
    def _check_geographic_risk(self, ip_address: str) -> bool:
        """Check if IP address originates from high-risk geographic location"""
        if not ip_address:
            return False
        
        # Simplified geolocation check (in production, use proper GeoIP service)
        country_code = self._get_country_code(ip_address)
        return country_code in self.threat_indicators['geo_risk_countries']
    
    def _get_ip_reputation(self, ip_address: str) -> str:
        """Get IP reputation from cache or external service"""
        if ip_address in self.ip_reputation_cache:
            return self.ip_reputation_cache[ip_address]
        
        # Simplified reputation check (in production, integrate with threat intelligence)
        try:
            ip_obj = ipaddress.ip_address(ip_address)
            if ip_obj.is_private:
                reputation = 'trusted'
            elif ip_obj.is_loopback:
                reputation = 'trusted'
            else:
                # Default to unknown for public IPs
                reputation = 'unknown'
        except ValueError:
            reputation = 'unknown'
        
        self.ip_reputation_cache[ip_address] = reputation
        return reputation
    
    def _get_country_code(self, ip_address: str) -> str:
        """Get country code for IP address (simplified implementation)"""
        # In production, use proper GeoIP database like MaxMind
        # This is a simplified example
        ip_hash = hashlib.md5(ip_address.encode()).hexdigest()
        # Simulate country code based on hash
        country_codes = ['US', 'CA', 'GB', 'DE', 'FR', 'JP', 'AU', 'CN', 'RU', 'BR']
        return country_codes[int(ip_hash[:2], 16) % len(country_codes)]
    
    def _generate_security_recommendations(self, threats: List[str]) -> List[str]:
        """Generate security recommendations based on detected threats"""
        recommendations = []
        
        if 'malicious_source_ip' in threats:
            recommendations.append("Block source IP address immediately")
            recommendations.append("Review firewall rules and update IP blacklist")
        
        if 'ddos_pattern' in threats:
            recommendations.append("Enable DDoS protection and rate limiting")
            recommendations.append("Consider using cloud-based DDoS mitigation service")
        
        if 'port_scan' in threats:
            recommendations.append("Block scanning IP and monitor for additional activity")
            recommendations.append("Review and harden exposed services")
        
        if 'suspicious_port' in threats:
            recommendations.append("Review necessity of exposed service on suspicious port")
            recommendations.append("Implement additional authentication for sensitive services")
        
        if 'geographic_risk' in threats:
            recommendations.append("Consider implementing geo-blocking for high-risk countries")
            recommendations.append("Require additional authentication for high-risk locations")
        
        return recommendations
    
    def generate_security_report(self, hours: int = 24) -> Dict:
        """Generate comprehensive security report"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        
        # Filter recent threats
        recent_threats = [
            threat for threat in self.threat_log
            if datetime.fromisoformat(threat['timestamp']) > cutoff_time
        ]
        
        # Analyze threat patterns
        threat_counts = defaultdict(int)
        source_ips = defaultdict(int)
        threat_levels = defaultdict(int)
        
        for threat in recent_threats:
            for threat_type in threat['threats_detected']:
                threat_counts[threat_type] += 1
            source_ips[threat['source_ip']] += 1
            threat_levels[threat['threat_level']] += 1
        
        # Generate report
        report = {
            'report_period': f"Last {hours} hours",
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_threats': len(recent_threats),
                'unique_source_ips': len(source_ips),
                'threat_distribution': dict(threat_counts),
                'threat_level_distribution': dict(threat_levels)
            },
            'top_threat_sources': sorted(
                source_ips.items(), 
                key=lambda x: x[1], 
                reverse=True
            )[:10],
            'recommendations': self._generate_overall_recommendations(threat_counts),
            'detailed_threats': recent_threats[-50:]  # Last 50 threats
        }
        
        return report
    
    def _generate_overall_recommendations(self, threat_counts: Dict) -> List[str]:
        """Generate overall security recommendations based on threat patterns"""
        recommendations = []
        
        if threat_counts.get('ddos_pattern', 0) > 10:
            recommendations.append("Implement advanced DDoS protection immediately")
        
        if threat_counts.get('port_scan', 0) > 5:
            recommendations.append("Review and minimize exposed services")
        
        if threat_counts.get('malicious_source_ip', 0) > 20:
            recommendations.append("Update threat intelligence feeds and IP blacklists")
        
        if threat_counts.get('geographic_risk', 0) > 50:
            recommendations.append("Consider implementing geographic access controls")
        
        recommendations.append("Regular security assessment and penetration testing")
        recommendations.append("Implement comprehensive logging and monitoring")
        
        return recommendations

# Usage example
security_monitor = NetworkSecurityMonitor()

# Simulate network traffic analysis
sample_traffic = [
    {
        'timestamp': datetime.now().isoformat(),
        'source_ip': '192.168.1.100',
        'destination_ip': '10.0.1.50',
        'protocol': 'TCP',
        'port': 80,
        'bytes': 1024
    },
    {
        'timestamp': datetime.now().isoformat(),
        'source_ip': '203.0.113.1',
        'destination_ip': '10.0.1.50',
        'protocol': 'TCP',
        'port': 22,
        'bytes': 512
    },
    {
        'timestamp': datetime.now().isoformat(),
        'source_ip': '198.51.100.1',
        'destination_ip': '10.0.1.50',
        'protocol': 'TCP',
        'port': 1433,
        'bytes': 256
    }
]

print("Network Security Analysis Results:")
print("=" * 50)

for traffic in sample_traffic:
    result = security_monitor.analyze_network_traffic(traffic)
    print(f"\nTraffic from {result['source_ip']}:")
    print(f"  Threat Level: {result['threat_level']}")
    print(f"  Threats: {result['threats_detected']}")
    if result['recommendations']:
        print(f"  Recommendations: {result['recommendations']}")

# Generate security report
report = security_monitor.generate_security_report(24)
print(f"\n24-Hour Security Report:")
print(f"Total Threats: {report['summary']['total_threats']}")
print(f"Threat Distribution: {report['summary']['threat_distribution']}")
```

### Free Resources

- [AWS WAF Documentation](https://docs.aws.amazon.com/waf/) - Web Application Firewall
- [Azure Firewall Documentation](https://docs.microsoft.com/en-us/azure/firewall/) - Azure network security
- [Google Cloud Armor](https://cloud.google.com/armor/docs) - DDoS protection and WAF
- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - Web application security risks

## Hands-On Exercises

### Exercise 1: Zero Trust Architecture Implementation

**Task:** Design and implement a zero trust security model for a multi-cloud environment.

**Requirements:**
- Implement dynamic trust scoring based on multiple factors
- Create conditional access policies based on trust levels
- Set up continuous authentication and authorization
- Implement comprehensive logging and monitoring
- Test with various user scenarios and risk profiles

### Exercise 2: Multi-Cloud Encryption Strategy

**Task:** Implement comprehensive data protection across AWS, Azure, and GCP.

**Requirements:**
- Set up key management services in each cloud
- Implement encryption at rest and in transit
- Create key rotation and lifecycle management
- Set up cross-cloud key sharing and backup
- Implement compliance monitoring and reporting

### Exercise 3: Advanced Threat Detection System

**Task:** Build a comprehensive threat detection and response system.

**Requirements:**
- Implement real-time network traffic analysis
- Create threat intelligence integration
- Set up automated incident response
- Build security dashboards and reporting
- Test with simulated attack scenarios

## Assessment Questions

1. **Design a zero trust architecture that works consistently across multiple cloud platforms.**

2. **Implement a comprehensive data encryption strategy that meets regulatory compliance requirements.**

3. **Create an advanced threat detection system that can identify and respond to sophisticated attacks.**

4. **Develop a security incident response plan that covers multi-cloud environments.**

5. **Design a compliance monitoring framework that ensures continuous adherence to security standards.**

## Next Steps

After completing this module:

1. **Implement advanced security controls** across multi-cloud environments
2. **Master compliance frameworks** and regulatory requirements
3. **Build automated security monitoring** and incident response capabilities
4. **Move to Module 4: Cloud-Native Development** to learn modern application development

## Additional Resources

### Security Frameworks
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework) - Comprehensive security framework
- [ISO 27001](https://www.iso.org/isoiec-27001-information-security.html) - Information security management
- [SOC 2](https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/aicpasoc2report.html) - Security compliance framework
- [CIS Controls](https://www.cisecurity.org/controls/) - Cybersecurity best practices

### Cloud Security Tools
- [AWS Security Hub](https://aws.amazon.com/security-hub/) - Centralized security findings
- [Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/) - Unified security management
- [Google Security Command Center](https://cloud.google.com/security-command-center) - Security insights platform
- [Cloud Security Alliance](https://cloudsecurityalliance.org/) - Cloud security guidance

Ready to build cloud-native applications? Continue to **Module 4: Cloud-Native Development and Containers** to master modern application development!
