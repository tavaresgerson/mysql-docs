### 8.5.1 Data-Masking Components Versus the Data-Masking Plugin

Previously, MySQL enabled masking and de-identification capabilities using a server-side plugin, but transitioned to use the component infrastructure as an alternative implementation. The following table briefly compares MySQL Enterprise Data Masking components and the plugin library to provide an overview of their differences. It may assist you in making the transition from the plugin to components.

Note

Only the data-masking components or the plugin should be enabled at a time. Enabling both components and the plugin is unsupported and results may not be as anticipated.

**Table 8.46 Comparison Between Data-Masking Components and Plugin Elements**

<table><col width="50%"/><col width="25%"/><col width="25%"/><thead><tr> <th>Category</th> <th>Components</th> <th>Plugin</th> </tr></thead><tbody><tr> <th>Interface</th> <td>Service functions, loadable functions</td> <td>Loadable functions</td> </tr><tr> <th>Support for multibyte character sets</th> <td>Yes, for general-purpose masking functions</td> <td>No</td> </tr><tr> <th>General-purpose masking functions</th> <td><code class="literal">mask_inner()</code>, <code class="literal">mask_outer()</code></td> <td><code class="literal">mask_inner()</code>, <code class="literal">mask_outer()</code></td> </tr><tr> <th>Masking of specific types</th> <td>PAN, SSN, IBAN, UUID, Canada SIN, UK NIN</td> <td>PAN, SSN</td> </tr><tr> <th>Random generation, specific types</th> <td>email, US phone, PAN, SSN, IBAN, UUID, Canada SIN, UK NIN</td> <td>email, US phone, PAN, SSN</td> </tr><tr> <th>Random generation of integer from given range</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Persisting substitution dictionaries</th> <td>Database</td> <td>File</td> </tr><tr> <th>Privilege to manage dictionaries</th> <td>Dedicated privilege</td> <td>FILE</td> </tr><tr> <th>Automated loadable-function registration/deregistration during installation/uninstallation</th> <td>Yes</td> <td>No</td> </tr><tr> <th>Enhancements to existing functions</th> <td>More arguments added to the <code class="literal">gen_rnd_email()</code> function</td> <td>N/A</td> </tr></tbody></table>
