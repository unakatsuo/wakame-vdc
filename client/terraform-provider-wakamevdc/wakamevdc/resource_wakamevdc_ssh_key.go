package wakamevdc

import (
  "github.com/axsh/wakame-vdc/client/go-wakamevdc"
  "github.com/hashicorp/terraform/helper/schema"
)

func resourceWakamevdcSSHKey() *schema.Resource {
  return &schema.Resource{
    Create: resourceWakamevdcSSHKeyCreate,
    Read: resourceWakamevdcSSHKeyRead,
    Update: resourceWakamevdcSSHKeyUpdate,
    Delete: resourceWakamevdcSSHKeyDelete,

    Schema: map[string]*schema.Schema{
      "id": &schema.Schema{
        Type:     schema.TypeString,
        Computed: true,
      },

      "display_name": &schema.Schema{
        Type:     schema.TypeString,
        Required: true,
      },

      "public_key": &schema.Schema{
        Type:     schema.TypeString,
        Optional: true,
        ForceNew: true,
      },

      "fingerprint": &schema.Schema{
        Type:     schema.TypeString,
        Computed: true,
      },
    },
  }
}

func resourceWakamevdcSSHKeyCreate(d *schema.ResourceData, m interface{}) error {
  client := m.(*wakamevdc.Client)

  params := wakamevdc.SshKeyCreateParams{
    DisplayName: d.Get("display_name").(string),
    PublicKey: d.Get("public_key").(string),
  }

  key, _, err := client.SshKey.Create(&params)

  d.SetId(key.ID)

  return err
}

func resourceWakamevdcSSHKeyRead(d *schema.ResourceData, m interface{}) error {
  return nil
}

func resourceWakamevdcSSHKeyUpdate(d *schema.ResourceData, m interface{}) error {
  return nil
}

func resourceWakamevdcSSHKeyDelete(d *schema.ResourceData, m interface{}) error {
  return nil
}
