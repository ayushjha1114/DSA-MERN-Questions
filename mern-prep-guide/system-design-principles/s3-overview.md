## 1. Basic S3 Concepts

### Q1: What is Amazon S3 and its key features?
**A:** Amazon S3 (Simple Storage Service) is an object storage service that stores files (objects) in buckets.

**Key features:**
- Highly durable (99.999999999% – 11 9’s)
- Scalable and available globally
- Multiple storage classes for cost optimization
- Versioning and lifecycle management
- Event notifications for changes

---

### Q2: Difference between S3 Standard, Standard-IA, One Zone-IA, Glacier

| Storage Class   | Use Case                                 | Durability | Cost      |
|-----------------|------------------------------------------|------------|-----------|
| Standard        | Frequently accessed data                  | 11 9’s     | High      |
| Standard-IA     | Infrequent access, instant retrieval      | 11 9’s     | Lower     |
| One Zone-IA     | Infrequent access, single AZ              | 11 9’s     | Even lower|
| Glacier         | Archival data, retrieval in minutes-hours | 11 9’s     | Lowest    |

---

### Q3: What is a bucket and an object?
- **Bucket:** Container for storing objects in S3 (globally unique name)
- **Object:** The actual data/file in S3 (consists of data, key, metadata)

---

### Q4: How does S3 achieve durability and availability?
- **Durability:** Data stored across multiple devices in multiple AZs.
- **Availability:** S3 replicates data automatically; uses versioning and checksums.

---

### Q5: What are S3 storage classes and when to use each?
- **Standard:** Frequently accessed
- **Standard-IA:** Infrequently accessed, instant retrieval
- **One Zone-IA:** Cheaper, single AZ, infrequently accessed
- **Glacier:** Archival, very cheap, retrieval delayed
- **Intelligent-Tiering:** Automatically moves data based on access pattern

---

### Q6: What is versioning in S3? How to enable it?
- **Versioning:** Keeps all versions of an object.
- **Enable:**  
    ```bash
    aws s3api put-bucket-versioning --bucket my-bucket --versioning-configuration Status=Enabled
    ```
- Allows recovering deleted or overwritten objects.

---

### Q7: Explain S3 consistency model
- **Strong read-after-write consistency:** Any new PUT/DELETE is immediately visible.
- Applies to all objects, in all regions (since Dec 2020).

---

### Q8: What is object lifecycle policy?
- Automates moving or deleting objects.
- *Example:* Move files older than 30 days to Glacier to reduce cost.

---

### Q9: Difference between S3 and EBS/EFS

| Feature | S3            | EBS           | EFS                          |
|---------|---------------|---------------|------------------------------|
| Type    | Object storage| Block storage | File storage                 |
| Access  | HTTP/SDK      | Mounted to EC2| Mounted to EC2 (NFS)         |
| Use     | Static files, logs, backups | OS, DB storage | Shared files between instances |

---

## 2. S3 Security

### Q1: How can you secure data in S3?
- Bucket policies, IAM roles, ACLs
- Server-side encryption (SSE) or client-side encryption
- Block public access
- VPC endpoints / private access

---

### Q2: Difference between Bucket Policy, ACL, IAM Policy
- **Bucket Policy:** Resource-based, attached to bucket, allows cross-account access
- **ACL:** Older, less granular, per object or bucket
- **IAM Policy:** User/role-based, defines which actions user can perform

---

### Q3: How do you make a bucket private or public?
- **Private:** Block public access + bucket policy restrict
- **Public:** Allow public read in bucket policy or ACL
