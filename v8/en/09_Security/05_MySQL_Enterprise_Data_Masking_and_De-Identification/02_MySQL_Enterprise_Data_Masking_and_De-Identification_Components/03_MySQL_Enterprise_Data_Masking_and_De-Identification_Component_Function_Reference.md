#### 8.5.2.3 MySQL Enterprise Data Masking and De-Identification Component Function Reference

**Table 8.46 MySQL Enterprise Data Masking and De-Identification Component Functions**

<table frame="box" rules="all" summary="A reference that lists MySQL Enterprise Data Masking and De-Identification functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th>
<th>Description</th>
<th>Introduced</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-blocklist"><code class="literal">gen_blocklist()</code></a></th>
<td>
      Perform dictionary term replacement
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-dictionary"><code class="literal">gen_dictionary()</code></a></th>
<td>
      Return random term from dictionary
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-range"><code class="literal">gen_range()</code></a></th>
<td>
      Generate random number within range
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-canada-sin"><code class="literal">gen_rnd_canada_sin()</code></a></th>
<td>
      Generate random Canada Social Insurance Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-email"><code class="literal">gen_rnd_email()</code></a></th>
<td>
      Generate random email address
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-iban"><code class="literal">gen_rnd_iban()</code></a></th>
<td>
      Generate random International Bank Account Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-pan"><code class="literal">gen_rnd_pan()</code></a></th>
<td>
      Generate random payment card Primary Account Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-ssn"><code class="literal">gen_rnd_ssn()</code></a></th>
<td>
      Generate random US Social Security Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-uk-nin"><code class="literal">gen_rnd_uk_nin()</code></a></th>
<td>
      Generate random United Kingdom National Insurance Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-us-phone"><code class="literal">gen_rnd_us_phone()</code></a></th>
<td>
      Generate random US phone number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_gen-rnd-uuid"><code class="literal">gen_rnd_uuid()</code></a></th>
<td>
      Generate random Universally Unique Identifier
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-canada-sin"><code class="literal">mask_canada_sin()</code></a></th>
<td>
      Mask Canada Social Insurance Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-iban"><code class="literal">mask_iban()</code></a></th>
<td>
      Mask International Bank Account Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-inner"><code class="literal">mask_inner()</code></a></th>
<td>
      Mask interior part of string
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-outer"><code class="literal">mask_outer()</code></a></th>
<td>
      Mask left and right parts of string
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-pan"><code class="literal">mask_pan()</code></a></th>
<td>
      Mask payment card Primary Account Number part of string
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-pan-relaxed"><code class="literal">mask_pan_relaxed()</code></a></th>
<td>
      Mask payment card Primary Account Number part of string
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-ssn"><code class="literal">mask_ssn()</code></a></th>
<td>
      Mask US Social Security Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-uk-nin"><code class="literal">mask_uk_nin()</code></a></th>
<td>
      Mask United Kingdom National Insurance Number
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_mask-uuid"><code class="literal">mask_uuid()</code></a></th>
<td>
      Mask Universally Unique Identifier part of string
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_masking-dictionary-remove"><code class="literal">masking_dictionary_remove()</code></a></th>
<td>
      Remove dictionary from the database table
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_masking-dictionary-term-add"><code class="literal">masking_dictionary_term_add()</code></a></th>
<td>
      Add new term to the dictionary
    </td>
<td>8.0.33</td>
</tr><tr><th scope="row"><a class="link" href="data-masking-component-functions.html#function_masking-dictionary-term-remove"><code class="literal">masking_dictionary_term_remove()</code></a></th>
<td>
      Remove existing term from the dictionary
    </td>
<td>8.0.33</td>
</tr></tbody></table>