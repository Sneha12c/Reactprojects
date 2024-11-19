
## Aggregation Pipeline

### $group
The $group stage separates documents into groups according to a "group key". The output is one document for each unique group key.

```
{
 $group:
   {
     _id: <expression>, // Group key
     <field1>: { <accumulator1> : <expression1> },
     ...
   }
 }
```

Accumulator ->
$avg - Returns an average of numerical values. Ignores non-numeric values.
$count - Returns the number of documents in a group.

### $lookup (aggregation)
Definition - Performs a left outer join to a collection in the same database to filter in documents from the "joined" collection 
for processing. The $lookup stage adds a new array field to each input document. The new array field contains the 
matching documents from the "joined" collection. The $lookup stage passes these reshaped documents to the next stage.

```
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       as: <output array field>
     }
}
```
pipeline -
Specifies the pipeline to run on the joined collection. The pipeline determines the resulting documents from the joined collection. To 
return all documents, specify an empty pipeline [].

### $match
Filters documents based on a specified query predicate. Matched documents are passed to the next pipeline stage.

```
{ $match: { <query predicate> } }
```

### $project
Passes along the documents with the requested fields to the next stage in the pipeline. The specified fields can be existing fields 
from the input documents or newly computed fields.

```
{ $project: { <specification(s)> } }

```
### $push
The $push operator appends a specified value to an array.

