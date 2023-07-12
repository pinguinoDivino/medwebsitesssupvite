import SubTitle from "_atoms/SubTitle";
import ImageDetail from "_molecules/ImageDetail";
import ContactDetail from "_molecules/ContactDetail";

const ContactDetailRow = ({ experience }) => {
  return (
    <section className="row text-center text-md-left p-1">
      <div className="col-12">
        <SubTitle text="Contatti" />
      </div>
      <ImageDetail image={experience.img ? experience.img : null} />
      <ContactDetail
        author={experience.author}
        authorYear={experience.author_year}
        authorContact={experience.author_contact}
        authorEmail={experience.author_email}
        reference={experience.ref}
      />
    </section>
  );
};

export default ContactDetailRow;
